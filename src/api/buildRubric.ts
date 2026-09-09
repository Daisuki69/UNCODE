import { getGeminiClient } from './geminiClient';
import { getPrompt } from './promptUtils';

interface BuildRubricOptions {
  content: string;
  resourcesText: string;
  userDraft?: string;
  apiKey: string;
  apiModel: string;
  customPrompts?: Record<string, string>;
  isGeneralKnowledge?: boolean;
}

export async function buildRubric(opts: BuildRubricOptions): Promise<string> {
  const { content, resourcesText, userDraft = 'None', apiKey, apiModel, customPrompts, isGeneralKnowledge } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);
  const prompt = getPrompt('buildRubricWithContext', {
    CONTENT: content,
    RESOURCES_TEXT: resourcesText,
    USER_DRAFT: userDraft,
  }, customPrompts);

  const hasGeneralKnowledge = Boolean(
    isGeneralKnowledge || 
    resourcesText.includes('SYSTEM NOTE') || 
    resourcesText.includes('external general knowledge')
  );

  const config: Record<string, any> = { temperature: 0.3 };
  if (hasGeneralKnowledge) {
    config.tools = [{ googleSearch: {} }];
  }

  let response;
  try {
    response = await ai.models.generateContent({
      model: apiModel || 'gemini-2.0-flash',
      contents: prompt,
      config,
    });
  } catch (err: any) {
    // If the chosen model or API key does not support the googleSearch grounding tool, gracefully fallback
    if (config.tools) {
      delete config.tools;
      response = await ai.models.generateContent({
        model: apiModel || 'gemini-2.0-flash',
        contents: prompt,
        config,
      });
    } else {
      throw err;
    }
  }

  return response.text ?? '';
}
