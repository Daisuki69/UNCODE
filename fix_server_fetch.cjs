const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The issue is fetch is not defined in Node.js v16/v17 natively without polyfills in older environments,
// BUT actually fetch IS available in Node 18+.
// The REAL issue might be FormData missing. Node 18 has fetch, but FormData is often tricky.

// Let's change how we call OCR.space API to not use FormData but use application/x-www-form-urlencoded
const ocrReplacement = `
async function extractTextFromImage(buffer, mimeType, ocrType, simpleKey, formattedKey) {
  let apiKey = ocrType === 'formatted' ? formattedKey : simpleKey;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error(\`Missing API Key for \${ocrType === 'formatted' ? 'Formatted' : 'Simple'} OCR. Please add it in Settings.\`);
  }

  const base64Data = \`data:\${mimeType};base64,\${buffer.toString('base64')}\`;
  
  const params = new URLSearchParams();
  params.append('apikey', apiKey);
  params.append('base64image', base64Data);
  
  if (ocrType === 'formatted') {
    params.append('isTable', 'true');
    params.append('scale', 'true');
  } else {
    params.append('OCREngine', '2');
  }

  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
  const data = await res.json();
`;

code = code.replace(
  /async function extractTextFromImage[\s\S]*?const res = await fetch\('https:\/\/api\.ocr\.space\/parse\/image', \{[\s\S]*?body: formData\n\s*\}\);\n\s*const data = await res\.json\(\);/,
  ocrReplacement.trim()
);

fs.writeFileSync('server.ts', code);
