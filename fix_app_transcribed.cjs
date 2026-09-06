const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const handleSubmitHomework = async \(file: File, scheduleId: string, ocrType: 'simple' \| 'formatted'\) => \{/,
  `const handleSubmitHomework = async (file: File, scheduleId: string, ocrType: 'simple' | 'formatted', transcribedText?: string) => {`
);

code = code.replace(
  /formData\.append\('role', settings\.role\);/,
  `formData.append('role', settings.role);\n      if (transcribedText) formData.append('transcribedText', transcribedText);`
);

code = code.replace(
  /onSubmitHomework=\{\(file, ocrType\) => handleSubmitHomework\(file, activeScheduleId, ocrType\)\}/g,
  `onSubmitHomework={(file, ocrType, text) => handleSubmitHomework(file, activeScheduleId, ocrType, text)}`
);

fs.writeFileSync('src/App.tsx', code);
