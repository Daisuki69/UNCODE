import { getGeminiClient } from './geminiClient';

interface GenerateTitleOptions {
  content: string;
  apiKey: string;
  apiModel: string;
}

export async function generateTitle(opts: GenerateTitleOptions): Promise<string> {
  const { content, apiKey, apiModel } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: `You are an AI assistant. Given the following document content, generate a very short, concise, and descriptive title (max 5-6 words). Do NOT return JSON, just the plain text title.\n\nContent:\n${content.substring(0, 3000)}`,
    config: { temperature: 0.3 },
  });

  return response.text?.trim() ?? '';
}
