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

const getApiKey = (req: express.Request): string | undefined => {
  const customKey = req.headers['x-api-key'];
  if (Array.isArray(customKey)) {
    return customKey[0] || process.env.GEMINI_API_KEY;
  }
  return typeof customKey === 'string' ? customKey : process.env.GEMINI_API_KEY;
};

const getApiModel = (req: express.Request): string => {
  const customModel = req.headers['x-api-model'];
  if (Array.isArray(customModel)) {
    return customModel[0] || 'gemini-3.7-flash';
  }
  return typeof customModel === 'string' ? customModel : 'gemini-3.7-flash';
};

const getGeminiClient = (req: express.Request) => {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    throw new Error('Server missing GEMINI_API_KEY and no custom key provided');
  }
  return new GoogleGenAI({ apiKey });
};

const parseJsonResponse = (textOutput: string | undefined) => {
  const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
  return JSON.parse(cleaned);
};

async function startServer() {
  
async function extractTextFromImage(buffer, mimeType, ocrType, simpleKey, formattedKey) {
  let apiKey = ocrType === 'formatted' ? formattedKey : simpleKey;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error(`Missing API Key for ${ocrType === 'formatted' ? 'Formatted' : 'Simple'} OCR. Please add it in Settings.`);
  }

  const formData = new FormData();
  formData.append('apikey', apiKey);
  formData.append('base64image', `data:${mimeType};base64,${buffer.toString('base64')}`);
  
  if (ocrType === 'formatted') {
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
  } else {
    formData.append('OCREngine', '2');
  }

  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();

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

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) {
        return res.status(500).json({ error: 'Server missing GEMINI_API_KEY and no custom key provided' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const mimeType = file.mimetype;
      const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.originalname.endsWith('.docx');
      
      let parts: any[] = [];
      
      if (isDocx) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        parts.push({ text: result.value });
      } else if (mimeType.startsWith('text/')) {
        parts.push({ text: file.buffer.toString('utf-8') });
      } else if (mimeType.startsWith('image/')) {
        // OCR via OCR.space API instead of direct inlineData
        const simpleKey = req.headers['x-simple-ocr-key'];
        const formattedKey = req.headers['x-formatted-ocr-key'];
        const ocrType = req.headers['x-ocr-type'] || 'simple';
        const extractedText = await extractTextFromImage(file.buffer, mimeType, ocrType, simpleKey, formattedKey);
        parts.push({ text: `[Extracted Text from Image via ${ocrType} OCR]:\n${extractedText}` });
      } else {
        throw new Error('Unsupported file type. Please upload DOCX, TXT, or Image.');
      }

      const docType = req.body.type || 'resource';
      
      // If it's homework, DO NOT summarize it with AI. Just return the raw extracted text.
      if (docType === 'homework') {
        let rawText = '';
        if (isDocx) {
          rawText = parts[0].text;
        } else if (mimeType.startsWith('text/')) {
          rawText = parts[0].text;
        } else if (mimeType.startsWith('image/')) {
           // We appended "[Extracted Text from Image via simple OCR]:\n" in parts[0]
           rawText = parts[0].text.split(']:\n')[1] || parts[0].text;
        }
        return res.json({ content: rawText, title: file.originalname });
      }

      const promptKey = 'parseResource';
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
        const result = parseJsonResponse(textOutput);
        res.json({ content: result.content || textOutput, title: result.title || file.originalname, error: result.error });
      } catch (error) {
        res.json({ content: textOutput, title: file.originalname });
      }
    } catch (error: any) {
      console.error('Error parsing document:', error);
      res.status(500).json({ error: error.message || 'An error occurred during parsing' });
    }
  });

  
  app.post('/api/generate-title', async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: "You are an AI assistant. Given the following document content, generate a very short, concise, and descriptive title (max 5-6 words). Do NOT return JSON, just the plain text title.\\n\\nContent:\\n" + content.substring(0, 3000),
        config: {
          temperature: 0.3,
        },
      });

      res.json({ title: response.text?.trim() });
    } catch (error) {
      console.error('Error generating title:', error);
      res.status(500).json({ error: 'Failed to generate title' });
    }
  });

  app.post('/api/declutter-resource', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const prompt = getPrompt(req, 'declutterResource', { TITLE: title || 'None', CONTENT: content });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const textOutput = response.text;
      let result;
      try {
        const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
        result = JSON.parse(cleaned);
      } catch (e) {
        return res.status(500).json({ error: "Invalid response from AI declutter" });
      }

      res.json(result);
    } catch (error: any) {
      console.error('Error during declutter:', error);
      res.status(500).json({ error: error.message || 'Failed to declutter resource' });
    }
  });

  app.post('/api/generate-answer', async (req, res) => {
    try {
      const { content, resourcesText, rubric } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const rubricSection = rubric ? `\n=== GRADING RUBRIC (MUST FOLLOW EXACTLY) ===\n${rubric}\n============================================\n` : '';
      const prompt = getPrompt(req, 'generateAnswer', { CONTENT: content, RUBRIC_SECTION: rubricSection, RESOURCES_TEXT: resourcesText });

      const response = await ai.models.generateContent({
        model: apiModel as string,
        contents: prompt,
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error('Error generating answer:', error);
      res.status(500).json({ error: error.message || 'Failed to generate answer' });
    }
  });

  app.post('/api/check-similarity', async (req, res) => {
    try {
      const { newHomework, existingHomeworks } = req.body;
      if (!newHomework || !existingHomeworks || existingHomeworks.length === 0) {
        return res.json({ similar: false, reason: '' });
      }

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const prompt = getPrompt(req, 'checkSimilarity', { NEW_HOMEWORK: newHomework, EXISTING_HOMEWORKS: existingHomeworks.map((hw, i) => `${i+1}. ${hw}`).join('\n') });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const textOutput = response.text;
      let result;
      try {
        const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
        result = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini output:", textOutput);
        return res.status(500).json({ error: "Invalid response from AI validator" });
      }
      res.json(result);
    } catch (error: any) {
      console.error('Error during similarity check:', error);
      res.status(500).json({ error: error.message || 'Failed to check similarity' });
    }
  });

  app.post('/api/validate-homework', async (req, res) => {
    try {
      const { content, resourcesText } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });
      if (!resourcesText) {
        return res.json({ valid: false, reason: "No resources were selected to validate against. Please go back and select at least one resource in Step 1." });
      }

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const prompt = getPrompt(req, 'validateHomework', { CONTENT: content, RESOURCES_TEXT: resourcesText });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const textOutput = response.text;
      let result;
      try {
        const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
        result = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini output:", textOutput);
        return res.status(500).json({ error: "Invalid response from AI validator" });
      }

      res.json(result);
    } catch (error: any) {
      console.error('Error during validation:', error);
      res.status(500).json({ error: error.message || 'Failed to validate homework' });
    }
  });

  app.post('/api/refine-rubric', async (req, res) => {
    try {
      const { baseRubric, content, resourcesText } = req.body;
      if (!baseRubric) return res.status(400).json({ error: 'No base rubric provided' });

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const prompt = getPrompt(req, 'refineRubricWithContext', { BASE_RUBRIC: baseRubric, RESOURCES_TEXT: resourcesText || '', CONTENT: content || '' });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
      });

      res.json({ rubric: response.text });
    } catch (error: any) {
      console.error('Error refining rubric:', error);
      res.status(500).json({ error: error.message || 'Failed to refine rubric' });
    }
  });

  app.post('/api/generate-rubric', async (req, res) => {
    try {
      const { content, role, resourcesText } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY and no custom key provided' });

      const ai = new GoogleGenAI({ apiKey });

      const prompt = getPrompt(req, 'generateRubricWithContext', { RESOURCES_TEXT: resourcesText || '', CONTENT: content });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
      });

      const textOutput = response.text;
      const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '';
      res.json({ rubric: cleaned });
    } catch (error: any) {
      console.error('Error generating rubric:', error);
      res.status(500).json({ error: error.message || 'Failed to generate rubric' });
    }
  });

  app.post('/api/correct-text', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'No text provided' });

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });

      const prompt = getPrompt(req, 'correctText', { TEXT: text });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: {
          temperature: 0.1,
        },
      });

      const corrected = response.text?.trim() || text;
      res.json({ corrected });
    } catch (error: any) {
      console.error('Error during auto-correct:', error);
      res.status(500).json({ error: error.message || 'Failed to correct text' });
    }
  });

  app.post('/api/evaluate', upload.single('homeworkImage'), async (req, res) => {
    try {
      const file = req.file;
      const { resources } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      if (!resources) {
        return res.status(400).json({ error: 'No resources provided' });
      }

      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) {
        return res.status(500).json({ error: 'Server missing GEMINI_API_KEY and no custom key provided' });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Check if user already provided edited text
      const userTranscribedText = req.body.transcribedText;
      const mimeType = file.mimetype;
      let imagePart = { text: '' };
      let wordCount = 0;
      let sentenceCount = 0;
      let finalExtractedText = '';

      if (mimeType.startsWith('image/')) {
        const simpleKey = req.headers['x-simple-ocr-key'];
        const formattedKey = req.headers['x-formatted-ocr-key'];
        const ocrType = req.headers['x-ocr-type'] || 'simple';
        
        // Use user text if available, otherwise do OCR
        finalExtractedText = userTranscribedText 
          ? userTranscribedText 
          : await extractTextFromImage(file.buffer, mimeType, ocrType, simpleKey, formattedKey);
           
        // OCR text often contains arbitrary line breaks per line of text.
        // This causes Intl.Segmenter to artificially count every line as a new sentence.
        // We replace all newlines with spaces purely for counting purposes to get an accurate linguistic count.
        const textForCounting = finalExtractedText.replace(/\n+/g, ' ');

        const wordSegmenter = new Intl.Segmenter('en', { granularity: 'word' });
        wordCount = Array.from(wordSegmenter.segment(textForCounting)).filter(s => s.isWordLike).length;
           
        const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
        sentenceCount = Array.from(sentenceSegmenter.segment(textForCounting)).filter(s => s.segment.trim().length > 0).length;

        imagePart = { text: `[Extracted Homework Answer via ${ocrType} OCR]:\n${finalExtractedText}\n\n[System Metrics]:\n- Word Count: ${wordCount}\n- Sentence Count: ${sentenceCount}` };
      } else {
         throw new Error('Only images are supported for evaluation.');
      }


      const response = await ai.models.generateContent({
        model: apiModel as string,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.

=== RUBRIC ===
${resources}
=============

Evaluate the homework text based on the rubric:
1. Does it answer the core subject-matter points?
2. CRITICAL: Ignore any rubric instructions that are physical/meta actions for the student to perform (e.g., "upload the file", "perform a manual count"). Do NOT fail the student for failing to write about uploading or counting.
3. If it's correct but super short, pass it.
4. If it's totally wrong or blank, fail it.

Output ONLY JSON:
{
  "passed": boolean,
  "feedback": "Plain-spoken feedback, 1-2 short sentences.",
  // "transcribedText": "No longer needed, server handles it"
}
`,
              },
              imagePart,
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const textOutput = response.text;
      let result;
      try {
        const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
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
    } catch (error: any) {
      console.error('Error during evaluation:', error);
      res.status(500).json({ error: error.message || 'An error occurred during evaluation' });
    }
  });

  app.post('/api/refine-prompt', async (req, res) => {
    try {
      const { promptText } = req.body;
      const apiModel = getApiModel(req);
      const apiKey = getApiKey(req);
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey });
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



  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    // Express 4 wildcard
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
