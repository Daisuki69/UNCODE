const fs = require('fs');
let dashboardCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regex = /<button[\s\S]*?Save Raw[\s\S]*?<\/button>/;
dashboardCode = dashboardCode.replace(regex, '');

fs.writeFileSync('src/components/Dashboard.tsx', dashboardCode);
