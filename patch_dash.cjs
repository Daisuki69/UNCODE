const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const origDash = `{resources.map((res) => (
              <div 
                key={res.id} 
                onClick={() => openEditResource(res)}
                className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 cursor-pointer transition-all shadow-sm flex items-center justify-between text-left w-full"
              >
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-3 group-hover:text-gray-900 transition-colors" />
                  <h3 className="font-bold text-gray-900 text-base">{res.title}</h3>
                </div>
              </div>
            ))}`;

const newDash = `{resources.map((res) => {
              const isLocked = settings.schedules.some(s => s.isActive && (s.selectedResourceIds || []).includes(res.id));
              return (
              <div 
                key={res.id} 
                onClick={() => {
                  if (isLocked) {
                    showError(\`Cannot edit "\${res.title}" because it is currently attached to an active schedule. Please pause the schedule first.\`);
                    return;
                  }
                  openEditResource(res);
                }}
                className={\`group p-4 bg-white border border-gray-200 rounded-xl transition-all shadow-sm flex items-center justify-between text-left w-full \${isLocked ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed' : 'hover:border-gray-900 cursor-pointer'}\`}
              >
                <div className="flex items-center">
                  <BookOpen className={\`w-5 h-5 mr-3 transition-colors \${isLocked ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-900'}\`} />
                  <h3 className={\`font-bold text-base \${isLocked ? 'text-gray-500' : 'text-gray-900'}\`}>{res.title}</h3>
                </div>
                {isLocked && <div className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 uppercase tracking-wider flex items-center"><ShieldAlert className="w-3 h-3 mr-1" /> Locked</div>}
              </div>
            )})}`;

if (code.includes(origDash)) {
  code = code.replace(origDash, newDash);
} else {
  console.log("Failed to find origDash");
}

const origCombine = `resources.filter(r => r.id !== mergingResource.id).map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onCombineResources(mergingResource.id, r.id);
                          setMergingResource(null);
                          { setNavDirection('backward'); setEditingResource(null); }; // Close the edit window too as they merged
                        }}
                        className="p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl flex flex-col text-left transition-colors"
                      >
                        <span className="font-bold text-gray-900">{r.title}</span>
                        <span className="text-xs text-gray-500 mt-1 line-clamp-1">{r.content}</span>
                      </button>
                    ))`;

const newCombine = `resources.filter(r => r.id !== mergingResource.id).map(r => {
                      const isLocked = settings.schedules.some(s => s.isActive && (s.selectedResourceIds || []).includes(r.id));
                      return (
                      <button
                        key={r.id}
                        onClick={() => {
                          if (isLocked) {
                            showError(\`Cannot combine with "\${r.title}" because it is currently attached to an active schedule.\`);
                            return;
                          }
                          onCombineResources(mergingResource.id, r.id);
                          setMergingResource(null);
                          { setNavDirection('backward'); setEditingResource(null); }; // Close the edit window too as they merged
                        }}
                        className={\`p-4 rounded-xl flex flex-col text-left transition-colors \${isLocked ? 'bg-gray-100 border border-gray-200 opacity-60 cursor-not-allowed' : 'bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200'}\`}
                      >
                        <div className="flex justify-between items-center w-full">
                           <span className={\`font-bold \${isLocked ? 'text-gray-500' : 'text-gray-900'}\`}>{r.title}</span>
                           {isLocked && <span className="text-[10px] font-bold text-red-500 uppercase">Locked</span>}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 line-clamp-1">{r.content}</span>
                      </button>
                    )})`;

if (code.includes(origCombine)) {
  code = code.replace(origCombine, newCombine);
} else {
  console.log("Failed to find origCombine");
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
