import { getGeminiClient } from './geminiClient';
import { getPrompt } from './promptUtils';

interface BuildRubricOptions {
  content: string;
  resourcesText: string;
  userDraft?: string;
  apiKey: string;
  apiModel: string;
  customPrompts?: Record<string, string>;
}

export async function buildRubric(opts: BuildRubricOptions): Promise<string> {
  const { content, resourcesText, userDraft = 'None', apiKey, apiModel, customPrompts } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);
  const prompt = getPrompt('buildRubricWithContext', {
    CONTENT: content,
    RESOURCES_TEXT: resourcesText,
    USER_DRAFT: userDraft,
  }, customPrompts);

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: prompt,
    config: { temperature: 0.3 },
  });

  return response.text ?? '';
}
