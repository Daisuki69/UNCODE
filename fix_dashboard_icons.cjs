const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /import \{ Clock, BookOpen, Trash2, Plus, Sparkles, Pencil, Upload, Loader2, Settings, ShieldAlert, X, GitMerge, Activity \} from 'lucide-react';/,
  `import { Clock, BookOpen, Trash2, Plus, Sparkles, Pencil, Upload, Loader2, Settings, ShieldAlert, X, GitMerge, FileText } from 'lucide-react';`
);

code = code.replace(
  /title="Activity Logs"/,
  `title="Homeworks Completed"`
);

code = code.replace(
  /<Activity className="w-5 h-5" \/>/,
  `<FileText className="w-5 h-5" />`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
