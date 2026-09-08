const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const blockToRemove = /app\.post\('\/api\/correct-text', async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: error\.message \|\| 'Failed to correct text' \}\);\n\s*\}\n\s*\}\);\n\n/;
code = code.replace(blockToRemove, '');

fs.writeFileSync('server.ts', code);
