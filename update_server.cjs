const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const buildRubricBlock = `  app.post('/api/build-rubric', async (req, res) => {
    try {
      const { content, resourcesText, userDraft } = req.body;
      const customKey = req.headers['x-api-key'];
      const apiModel = (req.headers['x-api-model']) || 'gemini-3.7-flash';
      const apiKey = customKey || process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const prompt = getPrompt(req, 'buildRubricWithContext', { 
        CONTENT: content, 
        RESOURCES_TEXT: resourcesText,
        USER_DRAFT: userDraft || "None"
      });

      const response = await ai.models.generateContent({
        model: apiModel,
        contents: prompt,
        config: { temperature: 0.3 }
      });
      res.json({ rubric: response.text });
    } catch (error) {
      let errMsg = error.message;
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "You have hit the Gemini API rate limit for this model. Please go to Settings and change the AI Model (e.g., to gemini-3.7-flash), or provide your own API key.";
      }
      res.status(500).json({ error: errMsg });
    }
  });`;

// We need to remove generate-rubric and refine-rubric
code = code.replace(/app\.post\('\/api\/generate-rubric'[\s\S]*?res\.status\(500\)\.json\(\{ error: errMsg \}\);\n\s*\}\n\s*\}\);\n/g, '');
code = code.replace(/app\.post\('\/api\/refine-rubric'[\s\S]*?res\.status\(500\)\.json\(\{ error: errMsg \}\);\n\s*\}\n\s*\}\);\n/g, '');

// Insert it before /api/evaluate
code = code.replace(/app\.post\('\/api\/evaluate'/g, buildRubricBlock + '\n\n  app.post(\'/api/evaluate\'');

fs.writeFileSync('server.ts', code);
