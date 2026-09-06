const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// In App.tsx, remove `custom={navDirection}` from `<motion.div ...>`
app = app.replace(/<motion\.div key="([^"]+)" custom=\{navDirection\}/g, '<motion.div key="$1"');

// In Dashboard.tsx, do the same
dashboard = dashboard.replace(/<motion\.div\n\s*key="([^"]+)"\n\s*custom=\{navDirection\}/g, '<motion.div\n            key="$1"');

fs.writeFileSync('src/App.tsx', app);
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
