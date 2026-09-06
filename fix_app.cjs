const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the closing tag for the main routes
code = code.replace(
  /<\/AnimatePresence>\s*<AnimatePresence>\s*\{appState === 'logs'/,
  `  </AnimatePresence>\n      </div>\n\n      <AnimatePresence>\n        {appState === 'logs'`
);

fs.writeFileSync('src/App.tsx', code);
