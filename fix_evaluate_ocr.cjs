const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /finalExtractedText = userTranscribedText\s*\?\s*userTranscribedText\s*:\s*await extractTextFromImage\(file\.buffer, mimeType, ocrType, simpleKey, formattedKey\);/;

const replacement = `if (!userTranscribedText) {
          throw new Error('Transcribed text is required for evaluation.');
        }
        finalExtractedText = userTranscribedText;`;

code = code.replace(regex, replacement);

fs.writeFileSync('server.ts', code);
