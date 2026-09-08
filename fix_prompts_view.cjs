const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsOverlay.tsx', 'utf8');

const regex = /\{activeTab === 'prompts' && \([\s\S]*?<div className="sticky bottom-0 bg-white\/90 backdrop-blur-md pt-4 pb-2 mt-8 border-t border-gray-100 flex justify-end">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/;

const replacement = `{activeTab === 'prompts' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                  View the system prompts used across the application. These prompts are hardcoded and cannot be modified from the UI.
                </p>
              </div>
              
              <div className="space-y-8">
                {Object.keys(defaultPrompts).map(key => (
                  <div key={key} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800 text-sm font-mono">{key}</h3>
                    </div>
                    <textarea
                      readOnly
                      value={defaultPrompts[key]}
                      className="w-full h-48 p-4 text-xs font-mono text-gray-700 bg-white resize-none focus:outline-none focus:ring-0 cursor-text"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/SettingsOverlay.tsx', code);
