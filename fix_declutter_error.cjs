const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regex = /const data = await res\.json\(\);[\s\S]*?if \(res\.ok && !data\.error\) \{[\s\S]*?\} else \{[\s\S]*?console\.error\("Declutter AI error", data\.error\);[\s\S]*?\}/;

const replacement = `const data = await res.json();
        if (res.ok && !data.error) {
          if (!newResTitle.trim() && data.title) finalTitle = data.title;
          if (data.content) finalContent = data.content;
        } else {
          console.error("Declutter AI error", data.error);
          
          let errMsg = data.error;
          if (typeof errMsg === 'object') {
             errMsg = errMsg.message || JSON.stringify(errMsg);
          }
          if (errMsg && (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota'))) {
            showError("AI Rate Limit Exceeded. Your resource was NOT saved. Please wait a minute or update your API Key.");
          } else {
            showError(\`AI Error: \${errMsg || 'Failed to clean up.'} Your resource was NOT saved.\`);
          }
          setIsDecluttering(false);
          return; // Stop the save process entirely
        }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
