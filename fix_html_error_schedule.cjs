const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

const regex = /throw new Error\(\`Server returned unexpected response \(\$\{res\.status\}\): \$\{text\.substring\(0, 50\)\}\.\.\.\`\);/;

const replacement = `if (text.includes('<!doctype html>') || text.includes('<!DOCTYPE html>')) {
          throw new Error('Server returned an unexpected page (possibly due to a proxy or cold start). Please try your upload again.');
        }
        throw new Error(\`Server returned unexpected response (\${res.status}): \${text.substring(0, 50)}...\`);`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/CreateSchedule.tsx', code);
