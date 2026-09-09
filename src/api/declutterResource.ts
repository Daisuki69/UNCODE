import { getGeminiClient } from './geminiClient';
import { getPrompt } from './promptUtils';

interface DeclutterOptions {
  title: string;
  content: string;
  apiKey: string;
  apiModel: string;
  customPrompts?: Record<string, string>;
}

export async function declutterResource(opts: DeclutterOptions): Promise<{ title: string; content: string }> {
  const { title, content, apiKey, apiModel, customPrompts } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  const ai = getGeminiClient(apiKey);
  const promptText = getPrompt('parseResource', {}, customPrompts);

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: [{
      role: 'user',
      parts: [
        { text: `Current Title: ${title || 'Untitled'}\n\nContent:\n${content}` },
        { text: promptText },
      ],
    }],
    config: { responseMimeType: 'application/json', temperature: 0.1 },
  });

  const textOutput = response.text ?? '{}';
  try {
    const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned);
    return {
      title: result.title || title || 'Untitled',
      content: result.content || textOutput,
    };
  } catch {
    // Salvage attempt
    const titleMatch = textOutput.match(/"title"\s*:\s*"([^"]*)"/);
    const contentMatch = textOutput.match(/"content"\s*:\s*"([\s\S]*)"\s*}/);
    if (contentMatch) {
      return {
        title: titleMatch ? titleMatch[1] : (title || 'Untitled'),
        content: contentMatch[1].replace(/\\n/g, '\n'),
      };
    }
    return { title: title || 'Untitled', content: textOutput };
  }
}
