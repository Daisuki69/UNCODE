import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import mammoth from 'mammoth';
import { defaultPrompts } from './defaultPrompts.js';
import { getPrompt } from './promptUtils.js';

// Setup file upload handling in memory
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

async function startServer() {
  
async function extractTextFromImage(buffer, mimeType, ocrType, simpleKey, formattedKey) {
  let apiKey = ocrType === 'formatted' ? formattedKey : simpleKey;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error(`Missing API Key for ${ocrType === 'formatted' ? 'Formatted' : 'Simple'} OCR. Please add it in Settings.`);
  }

  const formData = new FormData();
  formData.append('apikey', apiKey);
  
  // Create a Blob from the buffer and append it as 'file'
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('file', blob, 'upload.jpg');

  if (ocrType === 'formatted') {
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
  } else {
    formData.append('OCREngine', '2');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
  let res;
  try {
    res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('OCR API timed out. The service might be overloaded, please try again.');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
  
  if (!res.ok) {
     const text = await res.text();
     throw new Error(`OCR API Error (${res.status}): ${text.substring(0, 100)}`);
  }
  
  
  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(`OCR API returned invalid JSON: ${rawText.substring(0, 100)}`);
  }

  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage ? data.ErrorMessage.join(', ') : 'OCR Processing Error');
  }
  
  if (data.ParsedResults && data.ParsedResults.length > 0) {
    return data.ParsedResults.map(r => r.ParsedText).join('\n');
  }
  return "";
}

const app = express();
  const PORT = 3000;

  // Add JSON parsing middleware
  app.use(express.json());

  app.get('/api/default-prompts', (req, res) => {
    res.json(defaultPrompts);
  });
  
  app.post('/api/parse-resource', upload.single('document'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Server missing GEMINI_API_KEY and no custom key provided' });
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const mimeType = file.mimetype;
      const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.originalname.endsWith('.docx');
      
      let parts = [];
      
      if (isDocx) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        parts.push({ text: result.value });
      } else if (mimeType.startsWith('text/')) {
        parts.push({ text: file.buffer.toString('utf-8') });
      } else if (mimeType.startsWith('image/')) {
        const simpleKey = req.headers['x-simple-ocr-key'];
        const formattedKey = req.headers['x-formatted-ocr-key'];
        const ocrType = req.headers['x-ocr-type'] || 'simple';
        const extractedText = await extractTextFromImage(file.buffer, mimeType, ocrType, simpleKey, formattedKey);
        parts.push({ text: `[Extracted Text from Image via ${ocrType} OCR]:\n${extractedText}` });
      } else {
        throw new Error('Unsupported file type. Please upload DOCX, TXT, or Image.');
      }

      const docType = req.body.type || 'resource';
      
      if (docType === 'transcription') {
        let rawText = '';
        if (isDocx) {
          rawText = parts[0].text;
        } else if (mimeType.startsWith('text/')) {
          rawText = parts[0].text;
        } else if (mimeType.startsWith('image/')) {
           rawText = parts[0].text.split(']:\n')[1] || parts[0].text;
        }
        return res.json({ content: rawText, title: file.originalname });
      }

      const promptKey = docType === 'homework' ? 'parseHomework' : 'parseResource';
      const promptText = getPrompt(req, promptKey, {});
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });
      
      const textOutput = response.text;
      try {
        const cleaned = textOutput?.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim() || '{}';
        const result = JSON.parse(cleaned);
        res.json({ content: result.content || textOutput, title: result.title || file.originalname, error: result.error });
      } catch (e) {
        res.json({ content: textOutput, title: file.originalname });
      }
    } catch (error) {
      console.error('Error parsing document:', error);
      res.status(500).json({ error: error.message || 'An error occurred during parsing' });
    }
  });

  app.post('/api/generate-title', async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const customKey = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model'] || 'gemini-3.7-flash');
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: "You are an AI assistant. Given the following document content, generate a very short, concise, and descriptive title (max 5-6 words). Do NOT return JSON, just the plain text title.\n\nContent:\n" + content.substring(0, 3000),
        config: {
          temperature: 0.3,
        },
      });

      res.json({ title: response.text?.trim() });
    } catch (error) {
      console.error('Error generating title:', error);
      res.status(500).json({ error: 'An error occurred during title generation' });
    }
  });

  app.post('/api/declutter-resource', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });

      const promptText = getPrompt(req, 'parseResource', {});
      
      const parts = [
        { text: `Current Title: ${title || 'Untitled'}\n\nContent:\n${content}` },
        { text: promptText }
      ];

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const textOutput = response.text;
      let result = {};
      try {
        const cleaned = textOutput?.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim() || '{}';
        // Sometimes Gemini outputs unescaped newlines in JSON strings. Let's try to fix it before parsing.
        // We can just parse it if it's well-formed.
        result = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini output. Attempting regex salvage.");
        try {
          // Salvage title
          const titleMatch = textOutput.match(/"title"s*:s*"([^"]*)"/);
          // Salvage content (everything after "content": " until the last quote)
          const contentMatch = textOutput.match(/"content"s*:s*"([\s\S]*)"\s*}/);
          
          if (contentMatch) {
             let salvagedContent = contentMatch[1].replace(/\\n/g, '\n');
             result = { 
               title: titleMatch ? titleMatch[1] : (title || 'Untitled'), 
               content: salvagedContent 
             };
          } else {
             // If we couldn't salvage, at least don't dump JSON into the content window if it looks like JSON.
             if (textOutput.includes('"content":')) {
                result = { content: "Error: AI returned malformed JSON. Please try again.", title: title || 'Untitled' };
             } else {
                result = { content: textOutput, title: title || 'Untitled' };
             }
          }
        } catch(e2) {
          result = { content: textOutput, title: title || 'Untitled' };
        }
      }
      res.json(result);
    } catch (error) {
      console.error('Error decluttering:', error);
      res.status(500).json({ error: error.message || 'An error occurred during decluttering' });
    }
  });

  app.post('/api/generate-answer', async (req, res) => {
    try {
      const { content, resourcesText, rubric } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = getPrompt(req, 'generateAnswer', { CONTENT: content, RESOURCES_TEXT: resourcesText, RUBRIC_SECTION: rubric ? `=== RUBRIC ===\n${rubric}\n` : '' });

      const hasGeneralKnowledge = resourcesText && (
        resourcesText.includes('SYSTEM NOTE') || 
        resourcesText.includes('external general knowledge')
      );

      const config: any = { temperature: 0.3 };
      if (hasGeneralKnowledge) {
        config.tools = [{ googleSearch: {} }];
      }

      let response;
      try {
        response = await ai.models.generateContent({
          model: apiModel,
          contents: prompt,
          config
        });
      } catch (err: any) {
        if (config.tools) {
          delete config.tools;
          response = await ai.models.generateContent({
            model: apiModel,
            contents: prompt,
            config
          });
        } else {
          throw err;
        }
      }
      res.json({ answer: response.text });
    } catch (error) {
      let errMsg = error.message;
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "You have hit the Gemini API rate limit for this model. Please go to Settings and change the AI Model (e.g., to gemini-3.7-flash), or provide your own API key.";
      }
      res.status(500).json({ error: errMsg });
    }
  });

  app.post('/api/check-similarity', async (req, res) => {
    try {
      const { newHomework, existingHomeworks } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = getPrompt(req, 'checkSimilarity', { NEW_HOMEWORK: newHomework, EXISTING_HOMEWORKS: JSON.stringify(existingHomeworks) });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.1 }
      });
      const cleaned = response.text?.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim() || '{}';
      res.json(JSON.parse(cleaned));
    } catch (error) {
      let errMsg = error.message;
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "You have hit the Gemini API rate limit for this model. Please go to Settings and change the AI Model (e.g., to gemini-3.7-flash), or provide your own API key.";
      }
      res.status(500).json({ error: errMsg });
    }
  });

  app.post('/api/validate-homework', async (req, res) => {
    try {
      const { content, resourcesText } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = getPrompt(req, 'validateHomework', { CONTENT: content, RESOURCES_TEXT: resourcesText });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.1 }
      });
      const cleaned = response.text?.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim() || '{}';
      res.json(JSON.parse(cleaned));
    } catch (error) {
      let errMsg = error.message;
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "You have hit the Gemini API rate limit for this model. Please go to Settings and change the AI Model (e.g., to gemini-3.7-flash), or provide your own API key.";
      }
      res.status(500).json({ error: errMsg });
    }
  });

  
  
    app.post('/api/build-rubric', async (req, res) => {
    try {
      const { content, resourcesText, userDraft } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = getPrompt(req, 'buildRubricWithContext', { 
        CONTENT: content, 
        RESOURCES_TEXT: resourcesText,
        USER_DRAFT: userDraft || "None"
      });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: { temperature: 0.3 }
      });
      res.json({ rubric: response.text });
    } catch (error) {
      let errMsg = error.message;
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "You have hit the Gemini API rate limit for this model. Please go to Settings and change the AI Model (e.g., to gemini-3.7-flash), or provide your own API key.";
      }
      res.status(500).json({ error: errMsg });
    }
  });

  app.post('/api/evaluate', upload.single('homeworkImage'), async (req, res) => {
    try {
      const file = req.file;
      const { resources, transcribedText } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      if (!resources) {
        return res.status(400).json({ error: 'No resources provided' });
      }

      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Server missing GEMINI_API_KEY and no custom key provided' });
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const mimeType = file.mimetype;

      let wordCount = 0;
      let sentenceCount = 0;
      let finalExtractedText = '';

      if (mimeType.startsWith('image/')) {
        if (!transcribedText) {
          throw new Error('Transcribed text is required for evaluation.');
        }
        finalExtractedText = transcribedText;
        
        const textForCounting = finalExtractedText.replace(/\n+/g, ' ');
        const wordSegmenter = new Intl.Segmenter('en', { granularity: 'word' });
        wordCount = Array.from(wordSegmenter.segment(textForCounting)).filter(s => s.isWordLike).length;
        
        const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
        sentenceCount = Array.from(sentenceSegmenter.segment(textForCounting)).filter(s => s.segment.trim().length > 0).length;
      } else {
         throw new Error('Only images are supported for evaluation.');
      }

      const promptText = getPrompt(req, 'evaluateHomework', { RESOURCES: resources });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              { text: `[Extracted Homework Answer]:\n${finalExtractedText}\n\n[System Metrics]:\n- Word Count: ${wordCount}\n- Sentence Count: ${sentenceCount}` }
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const textOutput = response.text;
      let result;
      try {
        const cleaned = textOutput?.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim() || '{}';
        result = JSON.parse(cleaned);
        
        if (typeof wordCount !== 'undefined') {
          result.wordCount = wordCount;
          result.sentenceCount = sentenceCount;
        }
        result.transcribedText = finalExtractedText;
      } catch (e) {
        console.error("Failed to parse Gemini output:", textOutput);
        return res.status(500).json({ error: "Invalid response from AI grader" });
      }

      res.json(result);
    } catch (error) {
      console.error('Error during evaluation:', error);
      res.status(500).json({ error: error.message || 'An error occurred during evaluation' });
    }
  });

  app.post('/api/refine-prompt', async (req, res) => {
    try {
      const { promptText } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = req.headers['x-api-model'] || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
      
      const ai = new GoogleGenAI({ apiKey: apiKey });
      const refinePrompt = `Review this system prompt. If it has structural weaknesses, typos, or contradictions, gently refine it. 
CRITICAL RULE: DO NOT change any template variables like {{CONTENT}} or {{TITLE}}. Leave them EXACTLY as they are.
CRITICAL RULE: Keep it extremely direct and plain-spoken. Do not add conversational fluff.
If it looks completely fine as is, just return the exact same text back.
Output ONLY the refined prompt text.

=== PROMPT ===
${promptText}`;

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: refinePrompt
      });
      
      res.json({ refined: response.text });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message || 'Failed to refine prompt' });
    }
  });

  app.use((err, req, res, next) => {
    console.error('Unhandled Express Error:', err);
    if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File is too large.' });
    }
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
