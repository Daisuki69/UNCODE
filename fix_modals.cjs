const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We want to render Dashboard for dashboard, settings, and logs.
code = code.replace(
  /\{appState === 'dashboard' && \(/,
  "{['dashboard', 'settings', 'logs'].includes(appState) && ("
);

// We need to move the settings and logs modals OUT of the mode="wait" AnimatePresence.
// Let's do that manually using regex.
const logsModalRegex = /\{appState === 'logs' && \([\s\S]*?<\/ModalTransition>\s*\)\}/;
const settingsModalRegex = /\{appState === 'settings' && \([\s\S]*?<\/ModalTransition>\s*\)\}/;

const logsModal = code.match(logsModalRegex)[0];
const settingsModal = code.match(settingsModalRegex)[0];

code = code.replace(logsModalRegex, '');
code = code.replace(settingsModalRegex, '');

// Place them after the <AnimatePresence mode="wait">
const endOfAnimatePresence = code.indexOf('</AnimatePresence>', code.indexOf('<AnimatePresence mode="wait">', code.indexOf('dashboard')));
// Actually, let's just insert them right after `</AnimatePresence>` for the main routes.
code = code.replace(
  /<\/AnimatePresence>\s*<AnimatePresence>\{appState === 'evaluating' && \(/,
  `</AnimatePresence>\n\n      <AnimatePresence>\n        ${logsModal}\n        ${settingsModal}\n      </AnimatePresence>\n\n      <AnimatePresence>{appState === 'evaluating' && (`
);

fs.writeFileSync('src/App.tsx', code);
