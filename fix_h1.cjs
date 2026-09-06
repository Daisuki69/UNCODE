const fs = require('fs');
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(
  /<h1 className="text-2xl font-black tracking-tighter text-gray-900 cursor-pointer" onClick=\{\(\) => navigate\('dashboard', 'backward'>UNCODE<\/h1>/,
  `<h1 className="text-2xl font-black tracking-tighter text-gray-900">UNCODE</h1>`
);
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);
