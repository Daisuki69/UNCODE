const fs = require('fs');

function removePdf(file) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/accept="application\/pdf, text\/plain, image\/\*, \.docx, application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document"/g, 
                      'accept="text/plain, image/*, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document"');
  code = code.replace(/Upload PDF \/ DOCX \/ Image/g, 'Upload Image / DOCX / TXT');
  code = code.replace(/PDF, DOCX, PNG, JPG, TXT/g, 'DOCX, PNG, JPG, TXT');
  fs.writeFileSync(file, code);
}

removePdf('src/components/Dashboard.tsx');
removePdf('src/components/CreateSchedule.tsx');
// LockScreen only accepts image anyway
console.log("Stripped PDF");
