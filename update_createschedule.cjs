const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

// Update handleGenerateRubric
const oldGenerate = `      const res = await fetch('/api/generate-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: homeworkContent, role, resourcesText })
      });`;

const newGenerate = `      const res = await fetch('/api/build-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: homeworkContent, resourcesText, userDraft: "None" })
      });`;

code = code.replace(oldGenerate, newGenerate);

// Update handleRefineRubric
const oldRefine = `      const res = await fetch('/api/refine-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          baseRubric: tempRubric,
          content: homeworkContent,
          resourcesText 
        })
      });
      
      const data = await res.json();`;

const newRefine = `      const res = await fetch('/api/build-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          content: homeworkContent,
          resourcesText,
          userDraft: tempRubric
        })
      });
      
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(\`Server returned non-JSON: \${rawText.substring(0, 100)}\`);
      }`;

code = code.replace(oldRefine, newRefine);

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
