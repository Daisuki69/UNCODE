import { defaultPrompts } from './defaultPrompts.js';
import { Request } from 'express';

export function applyTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.split(`{{${key}}}`).join(value || '');
  }
  return result;
}

export function getPrompt(req: Request, promptKey: keyof typeof defaultPrompts, variables: Record<string, string>): string {
  let template = defaultPrompts[promptKey];
  if (req.headers['x-custom-prompts']) {
    try {
      const customPrompts = JSON.parse(req.headers['x-custom-prompts'] as string);
      if (customPrompts[promptKey]) {
        template = customPrompts[promptKey];
      }
    } catch (e) {
      console.warn('Failed to parse x-custom-prompts header');
    }
  }
  return applyTemplate(template, variables);
}
