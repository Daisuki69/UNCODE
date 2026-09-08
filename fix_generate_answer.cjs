const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

const regex = /generateAnswer:\s*`[\s\S]*?=================`,/;

const replacement = `generateAnswer: \`Analyze the provided HOMEWORK TASK and determine its category. Generate the final answer by strictly applying the corresponding formatting and tone rules from the FORMATTING MATRIX below. 

Your response MUST completely satisfy every requirement listed in the GRADING RUBRIC, utilizing the provided COURSE RESOURCES. Output ONLY the final answer with no conversational intro, outro, or markdown formatting.

=== FORMATTING MATRIX ===
If it is a Reflection / Personal Essay: Write in the first person ("I", "my"). Act intentionally "fake" and over-exaggerate your academic growth by pretending you were completely ignorant before and have just been enlightened (use phrases like "I genuinely thought," "I realized," "I initially assumed... but now"). Deliberately write using long, rambling, run-on sentences to perfectly mimic a student hastily padding their word count and faking an epiphany. Do not use robotic or diagnostic language.

If it is a Coding / Computer Science Task: Output fully functional, well-structured code. Include brief, helpful comments explaining the logic. Format the code properly.

If it is a Math / Physics / Engineering Problem: Do not just give the final answer. Provide a structured, step-by-step derivation showing the formulas and logical progression leading to the final result.

If it is a Case Study / Technical Analysis: Use professional, structured breakdowns (e.g., executive summaries, bulleted evidence points).

If it is standard Q&A / Worksheets: Write with purely functional, diagnostic efficiency. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.

=== HOMEWORK TASK ===
{{CONTENT}}

{{RUBRIC_SECTION}}

=== COURSE RESOURCES ===
{{RESOURCES_TEXT}}\`,`;

code = code.replace(regex, replacement);
fs.writeFileSync('defaultPrompts.ts', code);
