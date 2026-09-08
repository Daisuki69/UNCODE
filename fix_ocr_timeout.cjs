const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /const res = await fetch\('https:\/\/api\.ocr\.space\/parse\/image', \{\s*method: 'POST',\s*body: formData\s*\}\);/;

const replacement = `const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
  let res;
  try {
    res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('OCR API timed out. The service might be overloaded, please try again.');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }`;

if (code.includes("fetch('https://api.ocr.space/parse/image'")) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.ts', code);
}
