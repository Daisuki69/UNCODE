const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

// The block to remove:
/*
    let correctedContent = homeworkContent;

    // Auto-correct grammar
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;
      if (apiModel) headers['x-api-model'] = apiModel;
      
      const correctRes = await fetch('/api/correct-text', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: homeworkContent })
      });
      const correctData = await correctRes.json();
      if (correctRes.ok && correctData.corrected) {
        correctedContent = correctData.corrected;
        setHomeworkContent(correctedContent);
      }
    } catch (err: any) {
      console.error('Auto-correct error', err);
      showError(`AI Auto-correct Error: ${err.message || 'Unknown error. Check quota or API key.'}`);
      setIsValidating(false);
      return;
    }
*/

const blockToRemove = /let correctedContent = homeworkContent;[\s\S]*?\/\/ Auto-correct grammar[\s\S]*?\} catch \(err: any\) \{[\s\S]*?setIsValidating\(false\);\n\s*return;\n\s*\}/;
code = code.replace(blockToRemove, '');

// Also replace correctedContent with homeworkContent in the validation request
code = code.replace(/body: JSON\.stringify\(\{ content: correctedContent, resourcesText \}\)/, 'body: JSON.stringify({ content: homeworkContent, resourcesText })');

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
