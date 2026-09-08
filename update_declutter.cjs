const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the declutterResource prompt usage with parseResource
const regex = /const prompt = getPrompt\(req, 'declutterResource', \{ TITLE: title \|\| 'None', CONTENT: content \}\);[\s\S]*?const response = await ai\.models\.generateContent\(\{[\s\S]*?model: apiModel,[\s\S]*?contents: prompt,[\s\S]*?config: \{[\s\S]*?responseMimeType: 'application\/json',[\s\S]*?temperature: 0\.1,[\s\S]*?\},[\s\S]*?\}\);/m;

const replacement = `const promptText = getPrompt(req, 'parseResource', {});
      
      const parts = [
        { text: \`Current Title: \${title || 'Untitled'}\\n\\nContent:\\n\${content}\` },
        { text: promptText }
      ];

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
