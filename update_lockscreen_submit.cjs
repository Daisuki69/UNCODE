const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const oldSubmit = `  const handleSubmit = () => {
    if (selectedFile) {
      localStorage.removeItem(\`lockscreen_data_\${schedule.id}\`);
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };`;

const newSubmit = `  const handleSubmit = () => {
    if (selectedFile) {
      // NOTE: We no longer clear localStorage here. It is cleared in App.tsx ONLY if evaluation passes.
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };`;

code = code.replace(oldSubmit, newSubmit);
fs.writeFileSync('src/components/LockScreen.tsx', code);
