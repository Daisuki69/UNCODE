const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

app = app.replace(/<motion\.div key="([^"]+)" variants=\{pageVariants\}/g, '<motion.div key="$1" custom={navDirection} variants={pageVariants}');

// In Dashboard.tsx, the format might have newlines. Let's check it first.
fs.writeFileSync('src/App.tsx', app);
