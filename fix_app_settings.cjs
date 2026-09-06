const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /<SettingsOverlay\s*settings=\{settings\}\s*onSave=\{\(updates\) => \{/,
  `<SettingsOverlay
              settings={settings}
              logs={logs}
              onClearLogs={() => setLogs([])}
              onSave={(updates) => {`
);

fs.writeFileSync('src/App.tsx', app);
