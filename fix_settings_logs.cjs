const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsOverlay.tsx', 'utf8');

const logsBlock = `
          {activeTab === 'logs' && (
            <div className="max-w-3xl mx-auto flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  System activity logs are recorded here.
                </p>
                <button 
                  onClick={onClearLogs} 
                  className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center border border-red-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Clear Logs
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {logs.length === 0 ? (
                  <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                    <Activity className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No activity recorded yet.</p>
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="flex flex-col p-4 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-800 flex items-center">
                          {log.action === 'Error' && <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>}
                          {log.action}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center font-mono bg-gray-100 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(log.timestamp).toLocaleTimeString()} - {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {log.details && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono whitespace-pre-wrap">
                          {log.details}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
`;

code = code.replace(
  /          \}\)\}\n        <\/div>\n      <\/div>\n    <\/div>\n  \);\n\}/,
  `          })}
${logsBlock}
        </div>
      </div>
    </div>
  );
}`
);

fs.writeFileSync('src/components/SettingsOverlay.tsx', code);
