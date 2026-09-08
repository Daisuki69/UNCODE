const fs = require('fs');
let code = fs.readFileSync('src/components/CreateSchedule.tsx', 'utf8');

const regexOnChange = /onChange=\{\(e\) => \{[\s\S]*?if \(e\.target\.checked\) setSelectedResourceIds\(\[\.\.\.selectedResourceIds, r\.id\]\);[\s\S]*?else setSelectedResourceIds\(selectedResourceIds\.filter\(id => id !== r\.id\)\);[\s\S]*?setValidationError\(null\);[\s\S]*?\}\}/;

const replacementOnChange = `onChange={(e) => {
                        let newSelection = [...selectedResourceIds];
                        if (e.target.checked) {
                          newSelection.push(r.id);
                        } else {
                          newSelection = newSelection.filter(id => id !== r.id);
                        }
                        
                        // Enforce the rule: If "ai-general-knowledge" is selected, max 1 other resource allowed (total 2).
                        const hasAI = newSelection.includes('ai-general-knowledge');
                        if (hasAI && newSelection.length > 2) {
                          showError("When using General AI Knowledge, you can only select ONE other resource to append data to.");
                          return;
                        }

                        setSelectedResourceIds(newSelection);
                        setValidationError(null);
                      }}`;

code = code.replace(regexOnChange, replacementOnChange);
fs.writeFileSync('src/components/CreateSchedule.tsx', code);
