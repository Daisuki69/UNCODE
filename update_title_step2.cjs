const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

const titleInputCode = `
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Session Title</label>
              <input 
                type="text" 
                value={scheduleTitle}
                onChange={(e) => setScheduleTitle(e.target.value)}
                placeholder="e.g., Math Homework, History Essay"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
`;

// Insert it right after the Step 2 heading and description
code = code.replace(
  /<p className="text-gray-500 text-sm mb-4">What are you supposed to do\? Upload your assignment to extract the requirements\.<\/p>/,
  `<p className="text-gray-500 text-sm mb-4">What are you supposed to do? Upload your assignment to extract the requirements.</p>\n\n${titleInputCode}`
);

fs.writeFileSync('src/components/CreateSchedule.tsx', code);
