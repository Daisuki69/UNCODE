const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const newVariants = `const pageVariants = {
  initial: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? '100%' : '-100%'
  }),
  animate: { opacity: 1, x: 0 },
  exit: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? '-100%' : '100%'
  })
};`;

app = app.replace(/const pageVariants = \{[\s\S]*?\n\};\n/, newVariants + '\n');
dashboard = dashboard.replace(/const pageVariants = \{[\s\S]*?\n\};\n/, newVariants + '\n');

fs.writeFileSync('src/App.tsx', app);
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
