const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsOverlay.tsx', 'utf8');

code = code.replace(
  /import \{ AppSettings \} from '\.\.\/types';/,
  `import { AppSettings, LogEntry } from '../types';`
);

code = code.replace(
  /interface SettingsOverlayProps \{[\s\S]*?export function SettingsOverlay\(\{ settings, onSave, onClose \}: SettingsOverlayProps\) \{/,
  `interface SettingsOverlayProps {
  settings: AppSettings;
  logs: LogEntry[];
  onSave: (updates: Partial<AppSettings>) => void;
  onClearLogs: () => void;
  onClose: () => void;
}

export function SettingsOverlay({ settings, logs, onSave, onClearLogs, onClose }: SettingsOverlayProps) {`
);

code = code.replace(
  /const \[activeTab, setActiveTab\] = useState\<'general' \| 'prompts'\>\('general'\);/,
  `const [activeTab, setActiveTab] = useState<'general' | 'prompts' | 'logs'>('general');`
);

fs.writeFileSync('src/components/SettingsOverlay.tsx', code);
