const fs = require('fs');
let code = fs.readFileSync('defaultPrompts.ts', 'utf8');

// The declutterResource prompt starts at `declutterResource: ` and ends at the next property `, generateAnswer:`
// Let's use a regex to remove it
const regex = /\s*declutterResource:\s*`[\s\S]*?`,\s*(generateAnswer:)/;
code = code.replace(regex, '\n  $1');

fs.writeFileSync('defaultPrompts.ts', code);
