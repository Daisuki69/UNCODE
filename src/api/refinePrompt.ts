import { getGeminiClient } from './geminiClient';

interface RefinePromptOptions {
  promptText: string;
  apiKey: string;
  apiModel: string;
}

export async function refinePrompt(opts: RefinePromptOptions): Promise<string> {
  const { promptText, apiKey, apiModel } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);

  const refineInstruction = `Review this system prompt. If it has structural weaknesses, typos, or contradictions, gently refine it.
CRITICAL RULE: DO NOT change any template variables like {{CONTENT}} or {{TITLE}}. Leave them EXACTLY as they are.
CRITICAL RULE: Keep it extremely direct and plain-spoken. Do not add conversational fluff.
If it looks completely fine as is, just return the exact same text back.
Output ONLY the refined prompt text.

=== PROMPT ===
${promptText}`;

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: refineInstruction,
  });

  return response.text ?? promptText;
}
