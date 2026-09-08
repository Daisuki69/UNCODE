const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// It messed up the parse-resource block. Let's fix parse-resource back to normal.
const parseResourceStart = `      const promptText = getPrompt(req, promptKey, {});
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: apiModel as string,
        contents: [{ role: 'user', parts }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });`;

// Remove the injected evaluate block from lines 118-140 approx
code = code.replace(/const promptText = getPrompt\(req, promptKey, \{\}\);\n\s*parts\.push\(\{ text: promptText \}\);\n\n\s*const promptText = getPrompt\(req, 'evaluateHomework', \{ RESOURCES: resources \}\);[\s\S]*?responseMimeType: 'application\/json',/m, parseResourceStart + "\n      const textOutput = response.text;\n      try {\n        const cleaned = textOutput?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';\n        const result = JSON.parse(cleaned);\n        res.json({ content: result.content || textOutput, title: result.title || file.originalname, error: result.error });\n      } catch (e) {\n        res.json({ content: textOutput, title: file.originalname });\n      }\n    } catch (error: any) {\n      console.error('Error parsing document:', error);\n      res.status(500).json({ error: error.message || 'An error occurred during parsing' });\n    }\n  });\n\n  app.post('/api/generate-title', async (req, res) => {\n    try {\n      const { content } = req.body;\n      if (!content) return res.status(400).json({ error: 'No content provided' });\n\n      const customKey = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['x-api-key'];\n      const apiModel = (req.headers['x-api-model'] || 'gemini-3.7-flash');\n      const apiKey = customKey || process.env.GEMINI_API_KEY;\n      if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });\n\n      const ai = new GoogleGenAI({ apiKey: apiKey });\n\n      const response = await ai.models.generateContent({\n        model: apiModel,\n        contents: \"You are an AI assistant. Given the following document content, generate a very short, concise, and descriptive title (max 5-6 words). Do NOT return JSON, just the plain text title.\\n\\nContent:\\n\" + content.substring(0, 3000),\n        config: {\n          temperature: 0.3,\n        },\n      });\n\n      res.json({ title: response.text?.trim() });\n    } catch (error) {\n      console.error('Error generating title:', error);\n      res.status(500).json({ error: 'An error occurred during title generation' });\n    }\n  });\n\n  app.post('/api/declutter-resource', async (req, res) => {");

// Now we need to ALSO check where evaluate actually is and fix it.
fs.writeFileSync('server.ts', code);
