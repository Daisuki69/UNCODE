const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Step 1: Add finalExtractedText and replace extractedText inside the block
code = code.replace(
  /let sentenceCount = 0;\s*if \(mimeType\.startsWith\('image\/'\)\) \{/,
  `let sentenceCount = 0;\n      let finalExtractedText = '';\n\n      if (mimeType.startsWith('image/')) {`
);

code = code.replace(
  /const extractedText = userTranscribedText \n          \? userTranscribedText \n          : await extractTextFromImage\(file\.buffer, mimeType, ocrType, simpleKey, formattedKey\);/,
  `finalExtractedText = userTranscribedText \n          ? userTranscribedText \n          : await extractTextFromImage(file.buffer, mimeType, ocrType, simpleKey, formattedKey);`
);

code = code.replace(
  /const textForCounting = extractedText\.replace\(\/\\n\+\/g, ' '\);/,
  `const textForCounting = finalExtractedText.replace(/\\n+/g, ' ');`
);

code = code.replace(
  /\$\{extractedText\}/g,
  `\${finalExtractedText}`
);

// Step 2: Remove transcribedText from prompt JSON structure
code = code.replace(
  /"transcribedText": "Quick transcription of the image"/,
  `// "transcribedText": "No longer needed, server handles it"`
);

// Step 3: Explicitly set result.transcribedText
code = code.replace(
  /result\.sentenceCount = sentenceCount;\n\s*\}/,
  `result.sentenceCount = sentenceCount;\n        }\n        result.transcribedText = finalExtractedText;`
);

fs.writeFileSync('server.ts', code);
