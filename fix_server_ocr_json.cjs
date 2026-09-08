const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /const data = await res\.json\(\);/;

const replacement = `
  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    throw new Error(\`OCR API returned invalid JSON: \${rawText.substring(0, 100)}\`);
  }
`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.ts', code);
