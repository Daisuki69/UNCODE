const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

const oldPrompt = `declutterResource: \`Review the following study resource and format it into strict, machine-readable flashcards using Ecliptic's methodology.
Do not output conversational filler. Output ONLY a valid JSON object matching the requested schema.
The Master Syntax:
Your entire text output must be built on a single, unbreakable structure per line:
[Contextual Trigger] | [Isolated Variable]`;

const newPrompt = `declutterResource: \`Review the following study resource and format it into strict, machine-readable flashcards using Ecliptic's methodology.
Do not output conversational filler. Output ONLY a valid JSON object matching the following schema:
{"title": "Generate a concise proper title if the current one is generic (like 'Untitled' or a filename). Otherwise keep current title.", "content": "Your formatted flashcards string goes here. Do NOT use JSON arrays for the flashcards, put them all in this single string separated by newlines."}
The Master Syntax for the flashcards inside the 'content' field:
Your entire text output must be built on a single, unbreakable structure per line:
[Contextual Trigger] | [Isolated Variable]`;

code = code.replace(oldPrompt, newPrompt);
fs.writeFileSync('defaultPrompts.ts', code);
