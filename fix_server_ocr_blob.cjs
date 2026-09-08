const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newOcrFunction = `
async function extractTextFromImage(buffer, mimeType, ocrType, simpleKey, formattedKey) {
  let apiKey = ocrType === 'formatted' ? formattedKey : simpleKey;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    throw new Error(\`Missing API Key for \${ocrType === 'formatted' ? 'Formatted' : 'Simple'} OCR. Please add it in Settings.\`);
  }

  const formData = new FormData();
  formData.append('apikey', apiKey);
  
  // Create a Blob from the buffer and append it as 'file'
  const blob = new Blob([buffer], { type: mimeType });
  formData.append('file', blob, 'upload.jpg');

  if (ocrType === 'formatted') {
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
  } else {
    formData.append('OCREngine', '2');
  }

  const res = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
     const text = await res.text();
     throw new Error(\`OCR API Error (\${res.status}): \${text.substring(0, 100)}\`);
  }
  
  const data = await res.json();
`;

code = code.replace(
  /async function extractTextFromImage[\s\S]*?const data = await res\.json\(\);/,
  newOcrFunction.trim()
);

fs.writeFileSync('server.ts', code);
