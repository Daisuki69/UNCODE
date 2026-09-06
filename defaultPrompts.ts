export const defaultPrompts: Record<string, string> = {
  parseHomework: `Analyze the provided homework assignment. Extract core instructions, requirements, and questions. Strip LMS boilerplate, academic fluff, and padding. Adopt a functional, slightly cynical, diagnostic tone. Use direct, plain-spoken, unambiguous terms. Take the shortest path possible. Avoid AI-generated essay styles.

If the document does not contain recognizable homework instructions, assignment criteria, or questions to answer, you MUST refuse to process it. Do not attempt to guess or create a title or content. 
Note: Simple, broad, or generic headings DO count as valid homework assignments if they imply a standard academic task.

Output ONLY JSON in this format:
{
"title": "Generate a concise, proper title for this assignment based on its content. Do NOT use the raw filename.",
"content": "Core instructions.",
"error": "Only include this field if the document is completely unrelated to schoolwork, explaining briefly why."
}`,

  parseResource: `Analyze this document. Extract the educational content efficiently, decluttering noise (like page numbers, repetitive headers, or UI artifacts) without removing critical details. Format the extracted content into strict, machine-readable flashcards using Ecliptic's methodology.
Do not output conversational filler. Output ONLY a valid JSON object matching the requested schema.
The Master Syntax:
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
Generate a concise, proper resource title (e.g., 'History Chapter 4' or 'Math Syllabus' - DO NOT use the filename or generic prefixes like 'Extracted:').
Output ONLY JSON in the following format (with the content string containing the formatted flashcards, one per line):
{
  "title": "Generated Resource Title",
  "content": "[Flashcard 1]\\n[Flashcard 2]\\n..."
}`,

  declutterResource: `Review the following study resource and format it into strict, machine-readable flashcards using Ecliptic's methodology.
Do not output conversational filler. Output ONLY a valid JSON object matching the requested schema.
The Master Syntax:
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
If the title is generic (like a filename or "Untitled"), generate a proper concise title. Otherwise, keep the current title.
Current Title: {{TITLE}}
Content:
{{CONTENT}}
Output ONLY JSON in the following format (with the content string containing the formatted flashcards, one per line):
{
  "title": "The Title",
  "content": "[Flashcard 1]\\n[Flashcard 2]\\n..."
}`,

  generateAnswer: `Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.
Be extremely plain-spoken, practical, and highly concise to minimize token usage. Get straight to the point.
CRITICAL: Do NOT use any Markdown formatting like bolding (**) or bullet points (*). Output pure plain text.

=== HOMEWORK TASK ===
{{CONTENT}}
=====================
{{RUBRIC_SECTION}}
=== RESOURCES ===
{{RESOURCES_TEXT}}
=================`,

  checkSimilarity: `Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms. 
Are any of them the exact same assignment? Ignore minor wording differences. Be extremely plain-spoken and concise to minimize token usage.
Output ONLY JSON:
{
  "similar": boolean,
  "reason": "1 short sentence explaining which one it matches"
}

=== NEW HOMEWORK ===
{{NEW_HOMEWORK}}

=== EXISTING HOMEWORKS ===
{{EXISTING_HOMEWORKS}}
`,

  validateHomework: `Check if the homework task can be completed using the provided resources. Do not use outside knowledge.

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
{{RESOURCES_TEXT}}`,

  refineRubricWithContext: `Refine the user's rubric into a strict 4 to 5 item bulleted checklist anchored to the provided course resources. Strip all academic jargon and write in plain, direct, functional English. Never assume the user performed physical actions; instead, require a step-by-step mechanical explanation of the workflow. Preserve every hard constraint from the original rubric, such as length or formatting limits. Output only the bullets with no intro or outro.

=== USER'S ORIGINAL RUBRIC REQUIREMENTS ===
{{BASE_RUBRIC}}
=== COURSE RESOURCES (For Context & Topics) ===
{{RESOURCES_TEXT}}
=== HOMEWORK TASK (The Actual Assignment) ===
{{CONTENT}}`,

  generateRubricWithContext: `Generate a 3 to 5 item bulleted grading checklist for the homework task, anchored directly to the specific technical topics found in the course resources. Strip all academic jargon, abstract filler, and personal experience prompts; require step-by-step mechanical explanations of processes instead. Do not provide answers, only list required components. Output only the bullets with no intro or outro.

=== COURSE RESOURCES (For Context & Topics) ===
{{RESOURCES_TEXT}}
=== HOMEWORK TASK (The Actual Assignment) ===
{{CONTENT}}`,

  correctText: `Fix typos and grammar. Preserve the exact meaning. Keep the output strictly to the corrected text with no introductory or concluding remarks.

=== TEXT ===
{{TEXT}}`,

  evaluateHomework: `Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.

Evaluate the image:
1. Does it hit the core rubric points?
2. If it's correct but super short, pass it.
3. If it's totally wrong or blank, fail it.
Output ONLY JSON:
{
  "passed": boolean,
  "feedback": "Plain-spoken feedback, 1-2 short sentences.",
  "transcribedText": "Quick transcription of the image"
}

=== RUBRIC ===
{{RESOURCES}}
=============`
};
