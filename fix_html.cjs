const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /Reset\s*<\/button>\s*\)\}\s*<button/m,
  `Reset
                </button>
              )}
            </div>
            <button`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
