const fs = require('fs');

async function test() {
  const formData = new FormData();
  formData.append('document', new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' }), 'dummy.jpg');
  formData.append('type', 'homework');
  
  try {
    console.log("Sending image...");
    const res = await fetch('http://localhost:3000/api/parse-resource', {
      method: 'POST',
      headers: {
        'x-ocr-type': 'simple',
        'x-simple-ocr-key': 'helloworld'
      },
      body: formData
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
test();
