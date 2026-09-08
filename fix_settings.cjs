const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsOverlay.tsx', 'utf8');

// 1. Remove disabled={hasActiveSchedule} from AI Model select
code = code.replace(/<select\s+value=\{apiModel\}\s+disabled=\{hasActiveSchedule\}\s+onChange=\{/g, '<select\\n                  value={apiModel}\\n                  onChange={');

// 2. Remove disabled={hasActiveSchedule} from Reset button
code = code.replace(/onClick=\{handleClearGeneral\}\s+disabled=\{hasActiveSchedule\}\s+className="/g, 'onClick={handleClearGeneral}\\n                  className="');

// 3. Remove disabled={hasActiveSchedule} from Save button
code = code.replace(/onClick=\{handleSaveGeneral\}\s+disabled=\{hasActiveSchedule\}\s+className="/g, 'onClick={handleSaveGeneral}\\n                  className="');

fs.writeFileSync('src/components/SettingsOverlay.tsx', code);
