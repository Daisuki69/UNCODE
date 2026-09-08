const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

// 1. Fix handleGenerateRubric
const handleGenerateRubricRegex = /const handleGenerateRubric = async \(\) => \{[\s\S]*?body: JSON\.stringify\(\{ content: homeworkContent, resourcesText, userDraft: "None" \}\)\n\s*\}\);/g;

const match1 = code.match(handleGenerateRubricRegex);
if (match1) {
    let replacedFunc = match1[0].replace(/const selectedResources = resources\.filter\(r => selectedResourceIds\.includes\(r\.id\)\);\s*let resourcesText[\s\S]*?return;\s*\}/, `const selectedResources = resources.filter(r => selectedResourceIds.includes(r.id) && r.id !== 'ai-general-knowledge');
      let resourcesText = selectedResources.map(r => \`=== \${r.title} ===\\n\${r.content}\`).join('\\n\\n');
      
      if (selectedResourceIds.includes('ai-general-knowledge')) {
         resourcesText += '\\n\\n=== SYSTEM NOTE ===\\nThe AI is authorized to use external general knowledge to complete this task.';
      }`);
    code = code.replace(match1[0], replacedFunc);
}

// 2. Fix handleNextStep2 (validation bypass)
const handleNextStep2Regex = /const res = await fetch\('\/api\/validate-homework'[\s\S]*?body: JSON\.stringify\(\{ content: homeworkContent, resourcesText \}\)[\s\S]*?\}\);/g;
const match2 = code.match(handleNextStep2Regex);

// Wait, the easier way is to just look for setIsValidating(true) block
const validateBlockRegex = /setIsValidating\(true\);\s*if \(selectedResourceIds\.length > 0\) \{[\s\S]*?\}\s*setIsValidating\(false\);\s*setStep\(3\);/;

const newValidateBlock = `setIsValidating(true);
    
    // Auto-bypass validation if general knowledge is selected
    if (selectedResourceIds.includes('ai-general-knowledge')) {
      setIsValidating(false);
      setStep(3);
      return;
    }

    if (selectedResourceIds.length > 0) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiKey) headers['x-api-key'] = apiKey;
        if (apiModel) headers['x-api-model'] = apiModel;

        const selectedResources = resources.filter(r => selectedResourceIds.includes(r.id) && r.id !== 'ai-general-knowledge');
        const resourcesText = selectedResources.map(r => \`=== \${r.title} ===\\n\${r.content}\`).join('\\n\\n');
        
        const res = await fetch('/api/validate-homework', {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: homeworkContent, resourcesText })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to validate');
        }

        if (!data.valid) {
          setValidationError(\`Wait! Your homework task does not seem to be covered by the selected resources.\\n\\n\${data.reason}\\n\\nPlease revise your homework task or select the correct resources in Step 1.\`);
          setIsValidating(false);
          return;
        }
      } catch (err: any) {
        console.error('Validation error', err);
        showError(\`AI Validation Error: \${err.message || 'Unknown error. Check quota or API key.'}\`);
        addLog('Error', \`Validation failed: \${err.message}\`);
        setIsValidating(false);
        return;
      }
    }
    
    setIsValidating(false);
    setStep(3);`;

code = code.replace(validateBlockRegex, newValidateBlock);
fs.writeFileSync('src/components/CreateSchedule.tsx', code);
