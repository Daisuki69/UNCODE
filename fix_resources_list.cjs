const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-\[300px\] overflow-y-auto pr-2">[\s\S]*?<\/div>/,
  `<div className="flex flex-col space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {resources.map((res) => (
              <div 
                key={res.id} 
                onClick={() => openEditResource(res)}
                className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-900 cursor-pointer transition-all shadow-sm flex items-center justify-between text-left w-full"
              >
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-3 group-hover:text-gray-900 transition-colors" />
                  <h3 className="font-bold text-gray-900 text-base">{res.title}</h3>
                </div>
                <div className="text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                  Edit
                </div>
              </div>
            ))}
          </div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
