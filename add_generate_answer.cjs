const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const generateAnswerBlock = `
  app.post('/api/generate-answer', async (req, res) => {
    try {
      const { content, resourcesText, rubric } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = getPrompt(req, 'generateAnswer', { CONTENT: content, RESOURCES_TEXT: resourcesText, RUBRIC_SECTION: rubric ? \`=== RUBRIC ===\\n\${rubric}\\n\` : '' });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: { temperature: 0.3 }
      });
      res.json({ answer: response.text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
`;

code = code.replace(/app\.post\('\/api\/check-similarity'/g, generateAnswerBlock.trim() + "\n\n  app.post('/api/check-similarity'");

fs.writeFileSync('server.ts', code);
