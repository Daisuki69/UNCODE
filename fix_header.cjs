const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /<header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-10 shadow-sm gap-4">/,
  `<header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-2">`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
