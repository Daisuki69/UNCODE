const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsOverlay.tsx', 'utf8');

code = code.replace(
  /import \{ X, Key, Save, Trash2, Cpu, FileText, Wand2, RefreshCw, ArrowLeft \} from 'lucide-react';/,
  `import { X, Key, Save, Trash2, Cpu, FileText, Wand2, RefreshCw, ArrowLeft, Clock, Activity } from 'lucide-react';`
);

fs.writeFileSync('src/components/SettingsOverlay.tsx', code);
