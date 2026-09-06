const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const debugVariants = `const pageVariants = {
  initial: (direction: 'forward' | 'backward') => {
    console.log("initial direction:", direction);
    return {
      opacity: 0,
      x: direction === 'forward' ? '100%' : '-100%'
    };
  },
  animate: { opacity: 1, x: 0 },
  exit: (direction: 'forward' | 'backward') => {
    console.log("exit direction:", direction);
    return {
      opacity: 0,
      x: direction === 'forward' ? '-100%' : '100%'
    };
  }
};`;

app = app.replace(/const pageVariants = \{[\s\S]*?\n\};\n/, debugVariants + '\n');
fs.writeFileSync('src/App.tsx', app);
