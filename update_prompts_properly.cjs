const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf-8');

// Update validateHomework
const valOld = code.substring(code.indexOf('validateHomework: `'), code.indexOf('`,\n\n  refineRubricWithContext') + 1);

const valNew = `validateHomework: \`Check if the homework task can be completed using the provided resources. Do not use outside knowledge.

Rule 1: If the task asks for concepts or definitions missing from the resources, return false.
Rule 2: If the task asks to process the resources using standard formats like a reflection, summary, or essay, return true as long as the underlying subject matter is present in the resources, even if formatting instructions are absent.

Output ONLY JSON:
{
"valid": boolean,
"reason": "1 short plain-spoken sentence why it works or doesn't"
}

=== HOMEWORK TASK ===
{{CONTENT}}
=== RESOURCES ===
{{RESOURCES_TEXT}}\``;

code = code.replace(valOld, valNew);

// Remove WithoutContext entirely
const refineWithoutContextStart = code.indexOf('  refineRubricWithoutContext: `');
const refineWithoutContextEnd = code.indexOf('`,\n\n  generateRubricWithContext') + 3;
code = code.substring(0, refineWithoutContextStart) + code.substring(refineWithoutContextEnd);

const generateWithoutContextStart = code.indexOf('  generateRubricWithoutContext: `');
const generateWithoutContextEnd = code.indexOf('`,\n\n  correctText') + 3;
code = code.substring(0, generateWithoutContextStart) + code.substring(generateWithoutContextEnd);

// Also I'll rename WithContext variables to just the base names if we are deleting them, but to avoid touching server.ts I'll just leave them named WithContext in the defaultPrompts for now... Actually, no, let's rename them to refineRubric and generateRubric, and update server.ts and SettingsOverlay.tsx.

fs.writeFileSync('defaultPrompts.ts', code);
console.log("Updated defaultPrompts.ts");
