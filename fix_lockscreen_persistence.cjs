const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

const hookCode = `
  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(\`lockscreen_data_\${schedule.id}\`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.transcribedText) {
          setTranscribedText(parsed.transcribedText);
        }
        if (parsed.fileData && parsed.fileName && parsed.fileType) {
          fetch(parsed.fileData)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], parsed.fileName, { type: parsed.fileType });
              setSelectedFile(file);
              setPreviewUrl(URL.createObjectURL(file));
            });
        }
      } catch (e) {
        console.error("Failed to restore lockscreen data", e);
      }
    }
  }, [schedule.id]);

  // Save to local storage on change
  useEffect(() => {
    const saveData = async () => {
      let fileData = null;
      let fileName = null;
      let fileType = null;

      if (selectedFile) {
        fileName = selectedFile.name;
        fileType = selectedFile.type;
        const reader = new FileReader();
        fileData = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(selectedFile);
        });
      }

      const dataToSave = {
        transcribedText,
        fileData,
        fileName,
        fileType
      };
      
      if (!transcribedText && !selectedFile) {
         localStorage.removeItem(\`lockscreen_data_\${schedule.id}\`);
      } else {
         try {
           localStorage.setItem(\`lockscreen_data_\${schedule.id}\`, JSON.stringify(dataToSave));
         } catch(e) {
           console.warn("Storage quota exceeded, could not save image to local storage.");
         }
      }
    };

    saveData();
  }, [transcribedText, selectedFile, schedule.id]);
`;

const insertRegex = /const fileInputRef = useRef<HTMLInputElement>\(null\);\n/;
code = code.replace(insertRegex, "const fileInputRef = useRef<HTMLInputElement>(null);\n" + hookCode);

fs.writeFileSync('src/components/LockScreen.tsx', code);
