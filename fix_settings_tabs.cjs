const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsOverlay.tsx', 'utf8');

code = code.replace(
  /<button\n\s*onClick=\{\(\) => setActiveTab\('prompts'\)\}\n\s*className=\{\`flex-1 py-3 px-4 flex items-center justify-center font-bold text-sm transition-colors \$\{activeTab === 'prompts' \? 'bg-gray-100 text-gray-900 rounded-lg' : 'text-gray-500 hover:text-gray-700'\}\`\}\n\s*>\n\s*<FileText className="w-4 h-4 mr-2" \/>\n\s*AI Prompts\n\s*<\/button>/,
  `<button
                onClick={() => setActiveTab('prompts')}
                className={\`flex-1 py-3 px-4 flex items-center justify-center font-bold text-sm transition-colors \${activeTab === 'prompts' ? 'bg-gray-100 text-gray-900 rounded-lg' : 'text-gray-500 hover:text-gray-700'}\`}
              >
                <FileText className="w-4 h-4 mr-2" />
                AI Prompts
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={\`flex-1 py-3 px-4 flex items-center justify-center font-bold text-sm transition-colors \${activeTab === 'logs' ? 'bg-gray-100 text-gray-900 rounded-lg' : 'text-gray-500 hover:text-gray-700'}\`}
              >
                <Cpu className="w-4 h-4 mr-2" />
                Activity Logs
              </button>`
);

fs.writeFileSync('src/components/SettingsOverlay.tsx', code);
