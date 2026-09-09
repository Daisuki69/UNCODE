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

  parseResource: `Analyze this document. You are functioning as a lossless data parser. You must extract EVERY testable fact, definition, date, physical trait, specific speed/metric, and hardware example (e.g., ENIAC, IBM-1401) from the text. 
DO NOT summarize. DO NOT treat examples as optional; examples are mandatory testable data. Output ONLY a valid JSON object matching the requested schema.
The Master Syntax:
Your entire text output must be built on a single, unbreakable structure per line:
[Contextual Trigger] | [Isolated Variable]
The pipe symbol (|) acts as your absolute delimiter. Everything to the left is the front of the flashcard; everything to the right is the back. Do not use colons or dashes as delimiters.
Rule 1: Contextual Uniqueness & Strict List Grouping
The front of the flashcard (left side) acts as a primary key and MUST be 100% unique. 
- If a single concept has multiple examples or items, group them on the right side. 
- LIST FORMATTING OVERRIDE: You must aggressively delete the words "and", "or", and "&" from grouped lists. Separate items ONLY with commas. (Correct: "RAM, ROM". Incorrect: "RAM and ROM").
Rule 2: Anchor the Context (No Floating Prompts)
Anchor the subject in every single prompt (the left side).
Correct Example:
size of 1st Gen | computer was very large
Rule 3: Strip the Syntax Fat (With Semantic Integrity)
Treat the back of the card as raw data output and strip away useless conversational English. 
CRITICAL EXCEPTION: You MUST retain "milestone" context phrases (e.g., "first to realize," "invented," "sole creator"). These are highly testable trivia triggers and must never be compressed away. 
Rule 4: Lossless Abbreviation & Name Protection
Prioritize visual parsing speed. You must autonomously compress text, BUT you cannot destroy historical or identifying data.
- FULL NAME PRESERVATION: You must write out the full first and last names of all persons exactly as they appear (e.g., "Charles Babbage"). Initials (e.g., "C. Babbage") are STRICTLY FORBIDDEN.
- DATA PRESERVATION: Extract ALL examples, release years, and specs (e.g., do not skip the lists of famous computers for each generation).
- Convert all compound technical phrasing into standard industry acronyms.
- Convert all spelled-out ordinal numbers strictly into numerical ordinals.
- ON ETHICS/HISTORY: Do NOT abbreviate anything. Abbreviation logic must ONLY apply to technical topics, specs, and quantifiable concepts.
Generate a concise, proper resource title. Output ONLY JSON in the following format (with the content string containing the formatted flashcards, one per line):
{
  "title": "Generated Resource Title",
  "content": "[Flashcard 1]\n[Flashcard 2]\n..."
}`,
  generateAnswer: `Analyze the provided HOMEWORK TASK and determine its category. Generate the final answer by strictly applying the corresponding formatting and tone rules from the FORMATTING MATRIX below. 

Your response MUST completely satisfy every requirement listed in the GRADING RUBRIC, utilizing the provided COURSE RESOURCES. If COURSE RESOURCES authorizes general AI knowledge or external online information, you are fully empowered to draw from broad online knowledge, search for reference facts, and use your full reasoning to provide a complete, comprehensive, and accurate solution. Output ONLY the final answer with no conversational intro, outro, or markdown formatting.

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
{{RESOURCES_TEXT}}`,

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

  
  
    buildRubricWithContext: `Generate a 3 to 5 item bulleted grading checklist to evaluate a student's submission for the provided homework task.
Anchor the criteria strictly to the technical concepts found in the course resources. If COURSE RESOURCES authorizes general AI knowledge, you are authorized to draw from broad online knowledge and general pre-trained knowledge.
Format each bullet as an objective, verifiable condition that a grader can mark as Pass/Fail.
Do not write instructions, questions, or "how-to" steps. Do not provide the answers. Output only the bullets with no intro or outro.

If a "USER DRAFT" is provided below, you MUST use it as your foundation. Translate its specific constraints, requirements, or focus areas into the strict Pass/Fail bulleted format. Preserve every hard constraint from the draft.
If the "USER DRAFT" is "None" or empty, generate the criteria entirely from scratch based solely on the Course Resources and Homework Task.

=== USER DRAFT ===
{{USER_DRAFT}}

=== COURSE RESOURCES (For Context & Topics) ===
{{RESOURCES_TEXT}}

=== HOMEWORK TASK (The Actual Assignment) ===
{{CONTENT}}`,
  evaluateHomework: `Write with a purely functional, diagnostic efficiency. Eliminate all conversational fluff, academic jargon, and narrative detours. Use structurally precise, logically sequential, and direct language. Deliver raw cause-and-effect information in the shortest path possible using plain-spoken, unambiguous terms.

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
=============`
};
