const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regex = /<h2 className="text-3xl font-black text-gray-900">\s*\{editingResource === 'new' \? 'Add New Resource' : 'Edit Resource'\}\s*<\/h2>[\s\S]*?<\/form>/;

const replacement = `<h2 className="text-3xl font-black text-gray-900">
            {editingResource === 'new' ? 'Add New Resource' : 'Edit Resource'}
          </h2>
          <button onClick={() => { setNavDirection('backward'); setEditingResource(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSaveAndCleanup} className="flex-1 flex flex-col gap-6 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          {editingResource === 'new' && (
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="text/plain, image/*, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden" 
              />
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-700">Image OCR Type:</span>
                <select
                  value={ocrType}
                  onChange={(e) => setOcrType(e.target.value as 'simple' | 'formatted')}
                  className="bg-gray-50 text-sm text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 font-medium"
                >
                  <option value="simple">Simple OCR</option>
                  <option value="formatted">Formatted OCR (Tables)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsing}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {isParsing ? (
                  <Loader2 className="w-8 h-8 mb-2 animate-spin text-gray-400" />
                ) : (
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                )}
                <span className="font-bold text-gray-700">{isParsing ? 'Parsing document...' : 'Upload File'}</span>
                <span className="text-sm text-gray-400 mt-1">DOCX, PNG, JPG, TXT</span>
              </button>
              <div className="relative mt-8 mb-4 text-center">
                <span className="px-2 bg-white text-xs font-bold text-gray-400 uppercase tracking-wider">OR ENTER MANUALLY</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Resource Title</label>
            <input
              type="text"
              value={newResTitle}
              onChange={(e) => setNewResTitle(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 bg-gray-50 text-lg font-medium"
              placeholder="E.g., Chapter 4: Memory Management"
            />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Raw Text</label>
            <textarea
              value={newResContent}
              onChange={(e) => setNewResContent(e.target.value)}
              className="flex-1 min-h-[300px] w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 resize-none font-mono text-sm leading-relaxed"
              required
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              {editingResource !== 'new' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMergingResource(editingResource)}
                    className="px-6 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-xl transition-colors flex items-center"
                  >
                    <GitMerge className="w-5 h-5 mr-2" />
                    Combine with...
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-6 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-colors flex items-center"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Resource
                  </button>
                </>
              )}
            </div>
            <div className="flex space-x-4">
              <button 
                type="button" 
                onClick={() => {
                  { setNavDirection('backward'); setEditingResource(null); };
                  setIsConfirmingDelete(false);
                }}
                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
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
              </button>
            </div>
          </div>
        </form>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
