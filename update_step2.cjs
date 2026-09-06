const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf-8');

// First remove the title input from Step 4
const step4TitleRegex = /<div.*?>\s*<label.*?>Schedule Title<\/label>\s*<input[\s\S]*?className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 font-bold"\s*required\s*\/>\s*<\/div>/g;

// Also in Step 4, wait, the layout of Step 4:
const step4Div1 = `              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Schedule Title</label>
                <input
                  type="text"
                  placeholder="e.g. History Final Prep"
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 font-bold"
                  required
                />
              </div>`;
              
code = code.replace(step4Div1, '');

// Now replace Step 2 textarea
const step2TextareaRegex = /<textarea[\s\S]*?className="flex-1 w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 resize-none font-mono text-sm leading-relaxed mb-6"\s*\/>/g;

const newStep2Display = `
            {homeworkContent ? (
              <div className="flex-1 w-full p-4 rounded-xl border border-gray-200 bg-gray-50 mb-6 overflow-y-auto">
                <h4 className="font-bold text-gray-900 mb-2">{scheduleTitle}</h4>
                <p className="font-mono text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{homeworkContent}</p>
              </div>
            ) : (
              <div className="flex-1 w-full p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center mb-6 text-gray-400 text-sm">
                Upload a document to extract homework requirements.
              </div>
            )}
`;

code = code.replace(step2TextareaRegex, newStep2Display);

// Update step 2 description
code = code.replace(
  '<p className="text-gray-500 text-sm mb-6">What are you supposed to do? Upload your assignment or paste the text.</p>',
  '<p className="text-gray-500 text-sm mb-6">What are you supposed to do? Upload your assignment to extract the requirements.</p>'
);

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
console.log("Updated Step 2 and 4");
