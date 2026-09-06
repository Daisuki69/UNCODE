const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

code = code.replace(
  /setSelectedFile\(null\);\n\s*setPreviewUrl\(null\);\n\s*setTranscribedText\(null\);/,
  `setSelectedFile(null);\n                    setPreviewUrl(null);\n                    setTranscribedText(null);\n                    if (fileInputRef.current) fileInputRef.current.value = '';`
);

fs.writeFileSync('src/components/LockScreen.tsx', code);
