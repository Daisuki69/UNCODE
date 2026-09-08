const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const blockToRemove = /\/\/ If it's homework, DO NOT summarize it with AI\. Just return the raw extracted text\.[\s\S]*?const promptKey = 'parseResource';/;

code = code.replace(blockToRemove, `const promptKey = docType === 'homework' ? 'parseHomework' : 'parseResource';`);

fs.writeFileSync('server.ts', code);
