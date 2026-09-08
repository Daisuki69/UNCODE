const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Inside handleSubmitHomework, right after we set evaluation result and it passed
// Let's add the auto-harvesting logic there!

const regex = /if \(data\.passed\) {[\s\S]*?navigate\('result'\);/;

const replacement = `if (data.passed) {
        // Auto-Harvesting Logic
        if (activeSchedule?.selectedResourceIds?.includes('ai-general-knowledge')) {
          const textToHarvest = activeSchedule.aiAnswer || transcribedText || data.transcribedText;
          if (textToHarvest) {
            try {
              // Background call to declutter and save
              const headers: Record<string, string> = { 'Content-Type': 'application/json' };
              if (settings.apiKey) headers['x-api-key'] = settings.apiKey;
              if (settings.apiModel) headers['x-api-model'] = settings.apiModel;
              
              fetch('/api/declutter-resource', {
                method: 'POST',
                headers,
                body: JSON.stringify({ title: "AI Research: " + (activeSchedule.title || "Topic"), content: textToHarvest })
              }).then(res => res.json()).then(harvestData => {
                const realResources = activeSchedule.selectedResourceIds.filter(id => id !== 'ai-general-knowledge');
                if (realResources.length > 0) {
                  // Append to existing
                  setResources(prev => prev.map(r => r.id === realResources[0] ? { ...r, content: r.content + '\\n\\n' + harvestData.content } : r));
                } else {
                  // Create new
                  setResources(prev => [...prev, { id: crypto.randomUUID(), title: harvestData.title || "AI Research", content: harvestData.content, createdAt: Date.now() }]);
                }
              }).catch(console.error);
            } catch (e) {
              console.error("Auto harvest failed", e);
            }
          }
        }
        
        // Only clean up the lockscreen data if the student passed
        localStorage.removeItem(\`lockscreen_data_\${scheduleId}\`);
        navigate('result');`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
