const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `
      const docType = req.body.type || 'resource';
      
      if (docType === 'transcription') {
        let rawText = '';
        if (isDocx) {
          rawText = parts[0].text;
        } else if (mimeType.startsWith('text/')) {
          rawText = parts[0].text;
        } else if (mimeType.startsWith('image/')) {
           rawText = parts[0].text.split(']:\\n')[1] || parts[0].text;
        }
        return res.json({ content: rawText, title: file.originalname });
      }

      const promptKey = docType === 'homework' ? 'parseHomework' : 'parseResource';
`;

code = code.replace(/const docType = req\.body\.type \|\| 'resource';\n\s*const promptKey = docType === 'homework' \? 'parseHomework' : 'parseResource';/, replacement.trim());

fs.writeFileSync('server.ts', code);
