import { getGeminiClient } from './geminiClient';
import { getPrompt } from './promptUtils';

interface EvaluateOptions {
  transcribedText: string;
  rubric: string;
  apiKey: string;
  apiModel: string;
  customPrompts?: Record<string, string>;
}

export interface EvaluationResult {
  passed: boolean;
  feedback: string;
  transcribedText: string;
  wordCount: number;
  sentenceCount: number;
}

export async function evaluate(opts: EvaluateOptions): Promise<EvaluationResult> {
  const { transcribedText, rubric, apiKey, apiModel, customPrompts } = opts;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('Missing Gemini API Key. Please add it in Settings.');
  }

  // Compute word/sentence counts client-side (same logic as server)
  const textForCounting = transcribedText.replace(/\n+/g, ' ');
  const wordSegmenter = new Intl.Segmenter('en', { granularity: 'word' });
  const wordCount = Array.from(wordSegmenter.segment(textForCounting)).filter((s) => s.isWordLike).length;
  const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
  const sentenceCount = Array.from(sentenceSegmenter.segment(textForCounting)).filter((s) => s.segment.trim().length > 0).length;

  const ai = getGeminiClient(apiKey);
  const promptText = getPrompt('evaluateHomework', { RESOURCES: rubric }, customPrompts);

  const response = await ai.models.generateContent({
    model: apiModel || 'gemini-2.0-flash',
    contents: [{
      role: 'user',
      parts: [
        { text: promptText },
        { text: `[Extracted Homework Answer]:\n${transcribedText}\n\n[System Metrics]:\n- Word Count: ${wordCount}\n- Sentence Count: ${sentenceCount}` },
      ],
    }],
    config: { responseMimeType: 'application/json', temperature: 0.1 },
  });

  const textOutput = response.text ?? '{}';
  const cleaned = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
  const result = JSON.parse(cleaned);

  return {
    passed: result.passed ?? false,
    feedback: result.feedback ?? '',
    transcribedText,
    wordCount,
    sentenceCount,
  };
}
