const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

const replacement = `      if (data.title) setScheduleTitle(data.title);`;

// Find the block starting at "// Instantly call generate-title endpoint" and ending at "catch (e) { ... }"
const block = /\/\/ Instantly call generate-title endpoint[\s\S]*?console\.error\("Failed to generate title", e\);\n\s*\}/;

code = code.replace(block, replacement);

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
