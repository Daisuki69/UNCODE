const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

const titleGenerationCode = `
      setHomeworkContent(data.content);
      addLog('Uploaded Homework File', file.name);
      setValidationError(null);

      // Instantly call generate-title endpoint
      try {
        const titleRes = await fetch('/api/generate-title', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify({ content: data.content })
        });
        
        const titleData = await titleRes.json();
        if (titleRes.ok && titleData.title) {
           setScheduleTitle(titleData.title);
        }
      } catch (e) {
        console.error("Failed to generate title", e);
      }
`;

code = code.replace(
  /setHomeworkContent\(data\.content\);\n\s*\/\/ Removed schedule title extraction so we don't display the filename\n\s*\/\/ if \(data\.title\) setScheduleTitle\(data\.title\);\n\s*addLog\('Uploaded Homework File', file\.name\);\n\s*setValidationError\(null\);/,
  titleGenerationCode
);

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
