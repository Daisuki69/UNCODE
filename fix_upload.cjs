const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /formData\.append\('document', file\);/,
  `formData.append('document', file);\n    formData.append('type', 'homework'); // Skip AI parsing for raw OCR`
);

code = code.replace(
  /setNewResContent\(data\.content\);\n\s*if \(data\.title\) \{\n\s*setNewResTitle\(data\.title\);\n\s*\} else if \(!newResTitle\) \{\n\s*setNewResTitle\(file\.name\);\n\s*\}/,
  `setNewResContent(data.content);\n      // Leave title empty as requested`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
