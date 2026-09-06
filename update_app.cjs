const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /const res = await fetch\('\/api\/evaluate'[\s\S]*?const data = await res\.json\(\);\n      setEvaluationResult\(data\);/;

const replacement = `const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Failed to parse response as JSON. Raw text:", rawText.substring(0, 200));
        if (!res.ok) {
          throw new Error(\`Server error (\${res.status}): The server returned an invalid response. Please try again.\`);
        } else {
          throw new Error(\`Unexpected response format from server. Please try again.\`);
        }
      }

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('The image file is too large. Please compress it or take a lower resolution photo.');
        }
        if (res.status === 401 || (data.error && data.error.includes('UNAUTHENTICATED'))) {
          throw new Error('Invalid API Key. Please update your API key in the Settings overlay.');
        }
        throw new Error(data.error || 'Evaluation failed');
      }
      
      setEvaluationResult(data);`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
