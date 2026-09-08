const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

const regex = /declutterResource:\s*`[\s\S]*?Current Title:/;

const newPrompt = `declutterResource: \`Review the following study resource and format it into strict, machine-readable flashcards using Ecliptic's methodology.
Do not output conversational filler. Output ONLY a valid JSON object matching the following schema:
{"title": "Generate a concise proper title if the current one is generic (like 'Untitled' or a filename). Otherwise keep current title.", "content": "Your formatted flashcards string goes here. CRITICAL: You must escape all newlines in this JSON string using \\n. Do NOT use actual line breaks inside the JSON string value."}
The Master Syntax for the flashcards inside the 'content' field:
Your entire text output must be built on a single, unbreakable structure per line:
[Contextual Trigger] | [Isolated Variable]
The pipe symbol (|) acts as your absolute delimiter. Everything to the left is the front of the flashcard; everything to the right is the back. Do not use colons or dashes as delimiters.
Rule 1: Atomization (Never Group Variables)
Split every single fact into its own dedicated row. Do not group multiple facts on the back of a card.
Correct Example:
Diosdado was born in what? | small barrio of malabbac town of Iguig, Cagayan
Diosdado works on what? | high tech industry
Rule 2: Anchor the Context (No Floating Prompts)
Anchor the subject in every single prompt (the left side).
Correct Example:
size of 1st Gen | computer was very large
Size in 3rd Gen | Mini example IBM SYSTEM/360
Rule 3: Strip the Syntax Fat
Do not write conversational English on the back of the card (the right side). Strip away "The answer is," "It was," or "They are." Treat the back of the card as raw data output.
Correct Example:
Mill | Mill is CPU
Rule 4: Syntax Compression & Abbreviation (Mandatory)
Prioritize absolute utility and visual parsing speed. You must autonomously compress all text and numerical values into their shortest standard technical abbreviations or acronyms on both sides of the delimiter. Enforce the following generalized logic:
- Convert all compound technical phrasing into standard industry acronyms.
- Truncate all universally recognized common nouns into their shorthand prefixes.
- Convert all spelled-out ordinal numbers strictly into numerical ordinals.
- Convert all large numeric values or spelled-out thousands into base numbers appended with standard metric or alphabetic suffixes.
- Once any term is established, you must strictly mandate its shortest recognized abbreviation for every subsequent instance throughout the output.
- EXCEPTION: When it comes to ethics and related subjects, do NOT abbreviate anything. Abbreviation logic must ONLY apply to technical topics, specifications, and related quantifiable concepts.
Current Title:`;

code = code.replace(regex, newPrompt);
fs.writeFileSync('defaultPrompts.ts', code);
