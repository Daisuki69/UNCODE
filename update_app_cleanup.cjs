const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `if (data.passed) {
        navigate('result');
      } else {
        navigate('result');
      }`;

const replacementStr = `if (data.passed) {
        // Only clean up the lockscreen data if the student passed
        localStorage.removeItem(\`lockscreen_data_\${scheduleId}\`);
        navigate('result');
      } else {
        navigate('result');
      }`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
