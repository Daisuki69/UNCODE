const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /          <\/div>\n            \)\)\}\n          <\/div>/,
  `          </div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
