const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /<AnimatePresence custom=\{navDirection\}>/,
  `<AnimatePresence initial={false} custom={navDirection}>`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
