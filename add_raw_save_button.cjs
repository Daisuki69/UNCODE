const fs = require('fs');
let dashboardCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// The user might also want just a standard "Save" button to bypass cleanup entirely if the OCR is already perfect.
// Let's add a "Save Raw" button next to "Save & Cleanup"

const oldButtons = `<button 
                type="button"
                onClick={handleSaveAndCleanup}
                disabled={isDecluttering || (!newResTitle.trim() && !newResContent.trim())}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center disabled:opacity-50"
              >
                {isDecluttering ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Save & Clean Up</>
                )}
              </button>`;

const newButtons = `<button 
                type="button"
                onClick={() => {
                  if (editingResource === 'new') {
                    onAddResource(newResTitle || 'Untitled Resource', newResContent);
                  } else if (editingResource) {
                    onUpdateResource(editingResource.id, newResTitle, newResContent);
                  }
                  { setNavDirection('backward'); setEditingResource(null); };
                }}
                disabled={isDecluttering || (!newResTitle.trim() && !newResContent.trim())}
                className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Save Raw
              </button>
              
              <button 
                type="button"
                onClick={handleSaveAndCleanup}
                disabled={isDecluttering || (!newResTitle.trim() && !newResContent.trim())}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center disabled:opacity-50"
              >
                {isDecluttering ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Save & Clean Up</>
                )}
              </button>`;

dashboardCode = dashboardCode.replace(oldButtons, newButtons);
fs.writeFileSync('src/components/Dashboard.tsx', dashboardCode);
