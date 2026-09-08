const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /res\.status\(500\)\.json\(\{ error: error\.message \}\);/g;

const replacement = `
      let errMsg = error.message;
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        errMsg = "You have hit the Gemini API rate limit for this model. Please go to Settings and change the AI Model (e.g., to gemini-3.7-flash), or provide your own API key.";
      }
      res.status(500).json({ error: errMsg });
`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync('server.ts', code);
