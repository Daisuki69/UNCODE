const fs = require('fs');
let code = fs.readFileSync('src/components/EditRubric.tsx', 'utf8');

// Update handleGenerateRubric
const oldGenerate = `      const res = await fetch('/api/generate-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: schedule.homeworkContent, role, resourcesText })
      });
      const data = await res.json();`;

const newGenerate = `      const res = await fetch('/api/build-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: schedule.homeworkContent, resourcesText, userDraft: "None" })
      });
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(\`Server returned non-JSON: \${rawText.substring(0, 100)}\`);
      }`;

code = code.replace(oldGenerate, newGenerate);

// Update handleRefineRubric
const oldRefine = `      const res = await fetch('/api/refine-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          baseRubric: tempRubric,
          content: schedule.homeworkContent,
          resourcesText
        })
      });
      
      const data = await res.json();`;

const newRefine = `      const res = await fetch('/api/build-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          content: schedule.homeworkContent,
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

fs.writeFileSync('src/components/EditRubric.tsx', code);
