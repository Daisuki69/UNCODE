const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const regexResourcesText = /const resourcesText = resources\.filter\(r => \(schedule\.selectedResourceIds \|\| \[\]\)\.includes\(r\.id\)\)\.map\(r => `--- \$\{r\.title\} ---\\n\$\{r\.content\}`\)\.join\('\\n\\n'\);/;
const replacementResourcesText = `let resourcesText = resources.filter(r => (schedule.selectedResourceIds || []).includes(r.id)).map(r => \`--- \${r.title} ---\\n\${r.content}\`).join('\\n\\n');
      if ((schedule.selectedResourceIds || []).includes('ai-general-knowledge')) {
        resourcesText += '\\n\\n=== SYSTEM NOTE ===\\nThe AI is authorized to use external general knowledge to complete this task.';
      }`;

code = code.replace(regexResourcesText, replacementResourcesText);
fs.writeFileSync('src/components/LockScreen.tsx', code);
