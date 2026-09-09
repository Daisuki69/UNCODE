import { defaultPrompts } from '../../defaultPrompts';

export function applyTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.split(`{{${key}}}`).join(value || '');
  }
  return result;
}

export function getPrompt(
  promptKey: keyof typeof defaultPrompts,
  variables: Record<string, string>,
  customPrompts?: Record<string, string>
): string {
  let template = defaultPrompts[promptKey];
  if (customPrompts && customPrompts[promptKey]) {
    template = customPrompts[promptKey];
  }
  return applyTemplate(template, variables);
}
