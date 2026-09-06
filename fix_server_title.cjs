const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const generateTitleEndpoint = `
  app.post('/api/generate-title', async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ error: 'No content provided' });

      const customKey = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model'] || 'gemini-3.7-flash');
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: "You are an AI assistant. Given the following document content, generate a very short, concise, and descriptive title (max 5-6 words). Do NOT return JSON, just the plain text title.\\\\n\\\\nContent:\\\\n" + content.substring(0, 3000),
        config: {
          temperature: 0.3,
        },
      });

      res.json({ title: response.text?.trim() });
    } catch (error) {
      console.error('Error generating title:', error);
      res.status(500).json({ error: 'Failed to generate title' });
    }
  });
`;

code = code.replace(/app\.post\('\/api\/declutter-resource',/, generateTitleEndpoint + '\n  app.post(\'/api/declutter-resource\',');

fs.writeFileSync('server.ts', code);
