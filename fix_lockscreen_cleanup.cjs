const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const oldSubmit = `  const handleSubmit = () => {
    if (selectedFile) {
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };`;

const newSubmit = `  const handleSubmit = () => {
    if (selectedFile) {
      localStorage.removeItem(\`lockscreen_data_\${schedule.id}\`);
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };`;

code = code.replace(oldSubmit, newSubmit);

const oldTimeoutEffect = `  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((lockEndTime - getCurrentTime()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        onTimeout();
      }
    }, 1000);`;

const newTimeoutEffect = `  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((lockEndTime - getCurrentTime()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        localStorage.removeItem(\`lockscreen_data_\${schedule.id}\`);
        onTimeout();
      }
    }, 1000);`;

code = code.replace(oldTimeoutEffect, newTimeoutEffect);

const oldSkipBtn = `onClick={() => onTimeout(true)}`;
const newSkipBtn = `onClick={() => { localStorage.removeItem(\`lockscreen_data_\${schedule.id}\`); onTimeout(true); }}`;

code = code.replace(oldSkipBtn, newSkipBtn);

fs.writeFileSync('src/components/LockScreen.tsx', code);
