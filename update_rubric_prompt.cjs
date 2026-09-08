const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

const regex = /generateRubricWithContext:\s*`[\s\S]*?=== COURSE RESOURCES/;

const replacement = `generateRubricWithContext: \`Generate a 3 to 5 item bulleted grading checklist to evaluate a student's submission for the provided homework task.
Anchor the criteria strictly to the technical concepts found in the course resources.
Format each bullet as an objective, verifiable condition that a grader can mark as Pass/Fail.
Do not write instructions, questions, or "how-to" steps. Do not provide the answers. Output only the bullets with no intro or outro.

=== COURSE RESOURCES`;

code = code.replace(regex, replacement);
fs.writeFileSync('defaultPrompts.ts', code);
