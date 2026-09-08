const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

// The evaluateHomework in defaultPrompts has a "transcribedText" field which the server no longer needs
const newEvaluateHomework = `evaluateHomework: \`Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.

Evaluate the homework text based on the rubric:
1. Does it answer the core subject-matter points?
2. CRITICAL: Ignore any rubric instructions that are physical/meta actions for the student to perform (e.g., "upload the file", "perform a manual count"). Do NOT fail the student for failing to write about uploading or counting.
3. If it's correct but super short, pass it.
4. If it's totally wrong or blank, fail it.

Output ONLY JSON:
{
  "passed": boolean,
  "feedback": "Plain-spoken feedback, 1-2 short sentences."
}

=== RUBRIC ===
{{RESOURCES}}
=============\`
};`;

code = code.replace(/evaluateHomework: `[\s\S]*?`\n};/, newEvaluateHomework);

fs.writeFileSync('defaultPrompts.ts', code);
