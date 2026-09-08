const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `
      const promptText = getPrompt(req, 'evaluateHomework', { RESOURCES: resources });
      const response = await ai.models.generateContent({
        model: apiModel as string,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: promptText
              },
              imagePart,
            ],
          },
        ],
`;

code = code.replace(/const response = await ai\.models\.generateContent\(\{[\s\S]*?text: `Write with a purely functional[\s\S]*?`,\n\s*\},/m, replacement.trim() + ',');

fs.writeFileSync('server.ts', code);
