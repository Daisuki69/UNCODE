const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldTryCatch = `      try {
        const cleaned = textOutput?.replace(/\\\`\\\`\\\`json/g, '').replace(/\\\`\\\`\\\`/g, '').trim() || '{}';
        result = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini output:", textOutput);
        result = { content: textOutput, title: title || 'Untitled' };
      }`;

const newTryCatch = `      try {
        const cleaned = textOutput?.replace(/\\\`\\\`\\\`json/g, '').replace(/\\\`\\\`\\\`/g, '').trim() || '{}';
        // Sometimes Gemini outputs unescaped newlines in JSON strings. Let's try to fix it before parsing.
        // We can just parse it if it's well-formed.
        result = JSON.parse(cleaned);
      } catch (e) {
        console.error("Failed to parse Gemini output. Attempting regex salvage.");
        try {
          // Salvage title
          const titleMatch = textOutput.match(/"title"\s*:\s*"([^"]*)"/);
          // Salvage content (everything after "content": " until the last quote)
          const contentMatch = textOutput.match(/"content"\s*:\s*"([\\s\\S]*)"\\s*}/);
          
          if (contentMatch) {
             let salvagedContent = contentMatch[1].replace(/\\\\n/g, '\\n');
             result = { 
               title: titleMatch ? titleMatch[1] : (title || 'Untitled'), 
               content: salvagedContent 
             };
          } else {
             // If we couldn't salvage, at least don't dump JSON into the content window if it looks like JSON.
             if (textOutput.includes('"content":')) {
                result = { content: "Error: AI returned malformed JSON. Please try again.", title: title || 'Untitled' };
             } else {
                result = { content: textOutput, title: title || 'Untitled' };
             }
          }
        } catch(e2) {
          result = { content: textOutput, title: title || 'Untitled' };
        }
      }`;

code = code.replace(oldTryCatch, newTryCatch);
fs.writeFileSync('server.ts', code);
