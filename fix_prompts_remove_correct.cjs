const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

const blockToRemove = /correctText: `[\s\S]*?`,\n\s*/;
code = code.replace(blockToRemove, '');

fs.writeFileSync('defaultPrompts.ts', code);
