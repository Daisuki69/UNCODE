const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

// 1. Add "General AI Knowledge" to the resources list displayed in Step 1
const regexResourcesList = /resources\.map\(r => \(/;
const replacementResourcesList = `[
                  { id: 'ai-general-knowledge', title: '🌐 General AI Knowledge (Bypass validation)', content: 'Allows the AI to use its pre-trained general knowledge.' },
                  ...resources
                ].map(r => (`;
code = code.replace(regexResourcesList, replacementResourcesList);

// 2. Fix the "No resources available" check so it always shows the AI Knowledge option
const regexNoResources = /resources\.length === 0 \? \([\s\S]*?\) : \(/;
code = code.replace(regexNoResources, '(');

// 3. Fix handleNextStep2 (validation bypass)
const regexValidate = /const selectedResources = resources.filter\(r => selectedResourceIds.includes\(r.id\)\);\s*const resourcesText = selectedResources.map\(r => `=== \$\{r.title\} ===\\n\$\{r.content\}`\).join\('\\n\\n'\);/;
const replacementValidate = `const selectedResources = resources.filter(r => selectedResourceIds.includes(r.id));
        let resourcesText = selectedResources.map(r => \`=== \${r.title} ===\\n\${r.content}\`).join('\\n\\n');
        
        if (selectedResourceIds.includes('ai-general-knowledge')) {
           resourcesText += '\\n\\n=== SYSTEM NOTE ===\\nThe AI is authorized to use external general knowledge to complete this task. Validation ALWAYS passes.';
        }
        
        if (selectedResourceIds.includes('ai-general-knowledge')) {
          setIsValidating(false);
          setStep(3);
          return;
        }`;
code = code.replace(regexValidate, replacementValidate);

// 4. Also fix handleGenerateRubric resourcesText
const regexRubricText = /const selectedResources = resources\.filter\(r => selectedResourceIds\.includes\(r\.id\)\);\s*const resourcesText = selectedResources\.map\(r => `=== \$\{r\.title\} ===\\n\$\{r\.content\}`\)\.join\('\\n\\n'\);/;
const replacementRubricText = `const selectedResources = resources.filter(r => selectedResourceIds.includes(r.id));
      let resourcesText = selectedResources.map(r => \`=== \${r.title} ===\\n\${r.content}\`).join('\\n\\n');
      if (selectedResourceIds.includes('ai-general-knowledge')) {
         resourcesText += '\\n\\n=== SYSTEM NOTE ===\\nThe AI is authorized to use external general knowledge to complete this task.';
      }`;
code = code.replace(regexRubricText, replacementRubricText);

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
