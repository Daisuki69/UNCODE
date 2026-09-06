const fs = require('fs');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dashboard = dashboard.replace(
  /onChange=\{handleTimeOverride\}/g,
  `onChange={onTimeOverride}`
);

dashboard = dashboard.replace(
  /onClick=\{\(\) => setTimeOffset\(0\)\}/g,
  `onClick={onResetTime}`
);

fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
