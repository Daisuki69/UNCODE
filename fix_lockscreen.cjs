const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

// 1. Clean up interface
code = code.replace(/settings\?: any;\n/, '');

// 2. Add state variables for transcription
const stateBlock = `
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
`;
code = code.replace(/const \[ocrType, setOcrType\] = useState/, stateBlock + '\n  const [ocrType, setOcrType] = useState');

// 3. Update handleFileChange
const handleFileChangeCode = `
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("This image is too large (over 5MB). Please compress it or take a lower resolution photo before uploading.");
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Run OCR instantly
      setIsTranscribing(true);
      setTranscribedText(null);
      try {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('type', 'homework');
        
        const headers: Record<string, string> = {};
        if (settings.apiKey) headers['x-api-key'] = settings.apiKey;
        if (settings.apiModel) headers['x-api-model'] = settings.apiModel;
        if (settings.simpleOcrKey) headers['x-simple-ocr-key'] = settings.simpleOcrKey;
        if (settings.formattedOcrKey) headers['x-formatted-ocr-key'] = settings.formattedOcrKey;
        headers['x-ocr-type'] = ocrType;

        const res = await fetch('/api/parse-resource', {
          method: 'POST',
          headers,
          body: formData
        });
        
        const data = await res.json();
        if (res.ok && !data.error) {
          setTranscribedText(data.content);
        } else {
          setTranscribedText(\`[OCR Failed: \${data.error || 'Unknown error'}]\`);
        }
      } catch (err: any) {
        setTranscribedText(\`[OCR Error: \${err.message}]\`);
      } finally {
        setIsTranscribing(false);
      }
    }
  };
`;
code = code.replace(/const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\};\n/, handleFileChangeCode + '\n');

// 4. Update handleSubmit
const handleSubmitCode = `
  const handleSubmit = () => {
    if (selectedFile) {
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };
`;
code = code.replace(/const handleSubmit = \(\) => \{[\s\S]*?\};\n/, handleSubmitCode + '\n');

// 5. Render transcription box
const renderTranscriptionCode = `
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-gray-700">
                <img src={previewUrl} alt="Homework Preview" className="object-cover w-full h-full" />
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setTranscribedText(null);
                  }}
                  className="absolute top-4 right-4 bg-gray-900/80 p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full mb-6 flex flex-col">
                <h4 className="text-gray-400 font-medium mb-2 flex items-center justify-between">
                  <span>Transcribed Text</span>
                  {isTranscribing && <span className="text-xs text-indigo-400 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Extracting...</span>}
                </h4>
                <textarea
                  value={transcribedText || ''}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  disabled={isTranscribing}
                  placeholder={isTranscribing ? "Running OCR..." : "Transcription will appear here..."}
                  className="w-full h-32 bg-gray-950 border border-gray-700 rounded-xl p-3 text-sm text-gray-300 font-mono focus:border-indigo-500 focus:outline-none resize-none disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-2">You can edit the transcribed text before submitting to fix any OCR errors.</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isTranscribing}
                className="w-full py-4 bg-white text-black hover:bg-gray-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold rounded-xl transition-colors flex items-center justify-center"
              >
`;
code = code.replace(/<div className="relative w-full aspect-\[4\/3\] rounded-xl overflow-hidden mb-6 border border-gray-700">[\s\S]*?<button\s+onClick=\{handleSubmit\}\s+className="w-full py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-colors flex items-center justify-center"\s+>/, renderTranscriptionCode);

fs.writeFileSync('src/components/LockScreen.tsx', code);
