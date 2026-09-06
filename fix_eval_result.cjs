const fs = require('fs');
let code = fs.readFileSync('src/components/EvaluationResult.tsx', 'utf8');

code = code.replace(
  /<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transcription Excerpt<\/h3>/,
  `<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Transcription</h3>`
);

code = code.replace(
  /<p className="text-gray-600 font-mono text-sm italic">/,
  `<div className="text-gray-600 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">`
);

code = code.replace(
  /"\{result\.transcribedText\}"\n\s*<\/p>/,
  `{result.transcribedText}\n            </div>`
);

fs.writeFileSync('src/components/EvaluationResult.tsx', code);
