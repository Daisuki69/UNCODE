const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const regex = /if \(data\.answer\) {\s*setAiAnswer\(data\.answer\);\s*}/;
const replacement = `if (data.answer) {
        setAiAnswer(data.answer);
        // Save the AI answer to the schedule so it can be harvested
        schedule.aiAnswer = data.answer;
      }`;
code = code.replace(regex, replacement);

fs.writeFileSync('src/components/LockScreen.tsx', code);
