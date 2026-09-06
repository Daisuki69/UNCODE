const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace all `<PageTransition keyStr="X" direction={navDirection}>`
// with `<motion.div key="X" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">`

app = app.replace(
  /<PageTransition keyStr="([^"]+)" direction=\{([^\}]+)\}>/g,
  `<motion.div key="$1" custom={$2} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">`
);

app = app.replace(/<\/PageTransition>/g, `</motion.div>`);

fs.writeFileSync('src/App.tsx', app);
