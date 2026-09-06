const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf-8');

const targetRule = `- Once any term is established, you must strictly mandate its shortest recognized abbreviation for every subsequent instance throughout the output.`;
const newRule = `- Once any term is established, you must strictly mandate its shortest recognized abbreviation for every subsequent instance throughout the output.
- EXCEPTION: When it comes to ethics and related subjects, do NOT abbreviate anything. Abbreviation logic must ONLY apply to technical topics, specifications, and related quantifiable concepts.`;

if (code.includes(targetRule)) {
  code = code.replace(new RegExp(targetRule.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), newRule);
  fs.writeFileSync('defaultPrompts.ts', code);
  console.log("Updated Rule 4 with ethics exception!");
} else {
  console.error("Could not find the target rule string.");
}
