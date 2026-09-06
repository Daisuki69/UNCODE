const fs = require('fs');
const code = fs.readFileSync('defaultPrompts.ts', 'utf-8');
const start = code.indexOf('parseResource: `');
if (start !== -1) {
  const substr = code.substring(start, start + 2000);
  const end = substr.indexOf('`,');
  console.log(substr.substring(0, end));
}
