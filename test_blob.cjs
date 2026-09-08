const buffer = Buffer.from('hello world');
const blob = new Blob([buffer], { type: 'image/jpeg' });
const formData = new FormData();
formData.append('file', blob, 'upload.jpg');
console.log("Blob and FormData constructed successfully.");
