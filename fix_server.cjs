const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Line 89 uses extractedText
code = code.replace(
  /parts\.push\(\{ text: \`\[Extracted Text from Image via \$\{ocrType\} OCR\]:\\n\$\{extractedText\}\` \}\);/,
  `parts.push({ text: \`[Extracted Text from Image via \${ocrType} OCR]:\\n\${extractedText}\` });`
);

// Line 449 uses finalExtractedText
code = code.replace(
  /imagePart = \{ text: \`\[Extracted Homework Answer via \$\{ocrType\} OCR\]:\\n\$\{extractedText\}\\n\\n/,
  `imagePart = { text: \`[Extracted Homework Answer via \${ocrType} OCR]:\\n\${finalExtractedText}\\n\\n`
);

fs.writeFileSync('server.ts', code);
