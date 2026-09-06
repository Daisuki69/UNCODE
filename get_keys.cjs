const fs = require('fs');
const code = fs.readFileSync('defaultPrompts.ts', 'utf-8');
const keys = [];
const regex = /([a-zA-Z0-9_]+)\s*:\s*`/g;
let match;
while ((match = regex.exec(code)) !== null) {
  keys.push(match[1]);
}
console.log(keys);
