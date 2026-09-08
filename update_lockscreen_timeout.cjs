const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const targetStr = `      if (remaining === 0) {
        clearInterval(timer);
        onTimeout();
      }`;

const replacementStr = `      if (remaining === 0) {
        clearInterval(timer);
        localStorage.removeItem(\`lockscreen_data_\${schedule.id}\`);
        onTimeout();
      }`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/LockScreen.tsx', code);
