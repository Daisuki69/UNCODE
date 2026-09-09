import { getGeminiClient } from './geminiClient';
import { getPrompt } from './promptUtils';

interface GenerateAnswerOptions {
  content: string;
  resourcesText: string;
  rubric?: string;
  apiKey: string;
  apiModel: string;
  customPrompts?: Record<string, string>;
}

export async function generateAnswer(opts: GenerateAnswerOptions): Promise<string> {
  const { content, resourcesText, rubric, apiKey, apiModel, customPrompts } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);
  const prompt = getPrompt('generateAnswer', {
    CONTENT: content,
    RESOURCES_TEXT: resourcesText,
    RUBRIC_SECTION: rubric ? `=== RUBRIC ===\n${rubric}\n` : '',
  }, customPrompts);

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: prompt,
    config: { temperature: 0.3 },
  });

  return response.text ?? '';
}
