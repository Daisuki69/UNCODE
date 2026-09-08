const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

// Update handleGetAnswer to only fetch if aiAnswer is null
code = code.replace(
  'const handleGetAnswer = async () => {',
  `const handleGetAnswer = async (force = false) => {
    setShowAnswerPopup(true);
    if (aiAnswer && !force) return;
`
);

// We need to add the retry button to the UI
const popupFooterRegex = /<div className="px-6 py-4 border-t border-gray-800 bg-black\/20 flex justify-end">[\s\S]*?<\/div>/;

const newPopupFooter = `<div className="px-6 py-4 border-t border-gray-800 bg-black/20 flex justify-end space-x-3">
              <button 
                onClick={() => handleGetAnswer(true)}
                disabled={isGeneratingAnswer}
                className="px-6 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                Retry
              </button>
              <button 
                onClick={() => setShowAnswerPopup(false)}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>`;

code = code.replace(popupFooterRegex, newPopupFooter);

fs.writeFileSync('src/components/LockScreen.tsx', code);
