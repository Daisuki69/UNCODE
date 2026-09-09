import { getGeminiClient } from './geminiClient';
import { getPrompt } from './promptUtils';

// OCR directly via ocr.space API (supports CORS from browser)
async function extractTextFromImage(
  file: File,
  ocrType: 'simple' | 'formatted',
  simpleKey: string,
  formattedKey: string
): Promise<string> {
  const apiKey = ocrType === 'formatted' ? formattedKey : simpleKey;
  if (!apiKey || !apiKey.trim()) {
    throw new Error(`Missing API Key for ${ocrType === 'formatted' ? 'Formatted' : 'Simple'} OCR. Please add it in Settings.`);
  }

  const formData = new FormData();
  formData.append('apikey', apiKey);
  formData.append('file', file, file.name);

  if (ocrType === 'formatted') {
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
  } else {
    formData.append('OCREngine', '2');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  let res: Response;
  try {
    res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } catch (e: any) {
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
  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`OCR API returned invalid JSON: ${rawText.substring(0, 100)}`);
  }

  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage ? data.ErrorMessage.join(', ') : 'OCR Processing Error');
  }

  if (data.ParsedResults && data.ParsedResults.length > 0) {
    return data.ParsedResults.map((r: any) => r.ParsedText).join('\n');
  }
  return '';
}

// Extract text from .docx using mammoth (browser build)
async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth/mammoth.browser');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

interface ParseResourceOptions {
  file: File;
  type: 'resource' | 'homework' | 'transcription';
  apiKey: string;
  apiModel: string;
  ocrType?: 'simple' | 'formatted';
  simpleOcrKey?: string;
  formattedOcrKey?: string;
  customPrompts?: Record<string, string>;
}

export async function parseResource(opts: ParseResourceOptions): Promise<{ content: string; title: string; error?: string }> {
  const { file, type, apiKey, apiModel, ocrType = 'simple', simpleOcrKey = '', formattedOcrKey = '', customPrompts } = opts;

  const mimeType = file.type;
  const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx');

  let extractedText = '';

  if (isDocx) {
    extractedText = await extractTextFromDocx(file);
  } else if (mimeType.startsWith('text/')) {
    extractedText = await file.text();
  } else if (mimeType.startsWith('image/')) {
    extractedText = await extractTextFromImage(file, ocrType, simpleOcrKey, formattedOcrKey);
  } else {
    throw new Error('Unsupported file type. Please upload DOCX, TXT, or Image.');
  }

  // For transcription mode, return raw text immediately — no AI needed
  if (type === 'transcription') {
    return { content: extractedText, title: file.name };
  }

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);
  const promptKey = type === 'homework' ? 'parseHomework' : 'parseResource';
  const promptText = getPrompt(promptKey, {}, customPrompts);

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: extractedText }, { text: promptText }] }],
    config: { responseMimeType: 'application/json', temperature: 0.1 },
  });

  const textOutput = response.text ?? '{}';
  try {
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);
    return { content: result.content || textOutput, title: result.title || file.name, error: result.error };
  } catch {
    return { content: textOutput, title: file.name };
  }
}
