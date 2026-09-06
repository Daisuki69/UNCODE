const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const errorHandler = `
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
`;

const replaceWith = `
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled Express Error:', err);
    if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File is too large.' });
    }
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
`;

content = content.replace(errorHandler, replaceWith);
fs.writeFileSync('server.ts', content);
