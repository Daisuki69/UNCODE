const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

const regex = /const data = await res\.json\(\);/;

const replacement = `
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(\`Server returned non-JSON: \${rawText.substring(0, 100)}\`);
      }
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/CreateSchedule.tsx', code);
