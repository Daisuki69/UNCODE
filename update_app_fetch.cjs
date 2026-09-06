const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const oldCode = `      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('The image file is too large (likely over 5MB). Please compress it or take a lower resolution photo.');
        }
        let errorMsg = 'Evaluation failed';
        try {
          const data = await res.json();
          if (res.status === 401 || (data.error && data.error.includes('UNAUTHENTICATED'))) {
            throw new Error('Invalid API Key. Please update your API key in the Settings overlay.');
          }
          errorMsg = data.error || errorMsg;
        } catch (e) {
          if (e.message && e.message.includes('Invalid API Key')) throw e;
          errorMsg = \`Server error (\${res.status}): Please check the image size or try again later.\`;
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json();`;

const newCode = `      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const rawText = await res.text();
      let data = {};
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
          throw new Error('The image file is too large (likely over 5MB). Please compress it or take a lower resolution photo.');
        }
        if (res.status === 401 || (data.error && data.error.includes('UNAUTHENTICATED'))) {
          throw new Error('Invalid API Key. Please update your API key in the Settings overlay.');
        }
        throw new Error(data.error || 'Evaluation failed');
      }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/App.tsx', content);
