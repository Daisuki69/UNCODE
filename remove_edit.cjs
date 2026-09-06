const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /                <div className="text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">\n                  Edit\n                <\/div>\n/,
  ``
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
