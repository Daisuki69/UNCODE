const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Remove handleSaveResource and modify handleSaveAndCleanup
const saveMethodsRegex = /const handleSaveResource = async \(e: React\.FormEvent\) => \{[\s\S]*?const handleSaveAndCleanup = async \(e: React\.FormEvent\) => \{/;
code = code.replace(saveMethodsRegex, `const handleSaveAndCleanup = async (e: React.FormEvent) => {`);

// 2. Fix handleSaveAndCleanup title logic
const handleSaveAndCleanupRegex = /if \(data\.title\) finalTitle = data\.title;/;
code = code.replace(handleSaveAndCleanupRegex, `if (!newResTitle.trim() && data.title) finalTitle = data.title;`);

// 3. Remove "Save Resource" button
const buttonsRegex = /<button\s+type="button"\s+onClick=\{handleSaveResource\}[\s\S]*?<\/button>\s*<button\s+type="button"\s+onClick=\{handleSaveAndCleanup\}/;
code = code.replace(buttonsRegex, `<button \n                type="button"\n                onClick={handleSaveAndCleanup}`);

fs.writeFileSync('src/components/Dashboard.tsx', code);
