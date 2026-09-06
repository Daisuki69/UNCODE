const fs = require('fs');
let code = fs.readFileSync('src/components/LockScreen.tsx', 'utf8');

// 1. Add RefreshCcw to imports
code = code.replace(
  /import \{ Lock, Upload, Camera, FileWarning, CheckCircle, Sparkles, X, Loader2 \} from 'lucide-react';/,
  `import { Lock, Upload, Camera, FileWarning, CheckCircle, Sparkles, X, Loader2, RefreshCcw } from 'lucide-react';`
);

// 2. Extract OCR logic and update handleFileChange
const extractLogic = `
  const runOCR = async (file: File) => {
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
  };

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

      runOCR(file);
    }
  };
`;
code = code.replace(/const handleFileChange = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\}\s*\};\n/, extractLogic);

// 3. Add Retry button to the UI
const uiLogic = `
                <h4 className="text-gray-400 font-medium mb-2 flex items-center justify-between">
                  <span>Transcribed Text</span>
                  <div className="flex items-center space-x-3">
                    {isTranscribing && <span className="text-xs text-indigo-400 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Extracting...</span>}
                    <button 
                      onClick={() => selectedFile && runOCR(selectedFile)}
                      disabled={isTranscribing || !selectedFile}
                      className="text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center disabled:opacity-50"
                    >
                      <RefreshCcw className="w-3 h-3 mr-1" /> Retry OCR
                    </button>
                  </div>
                </h4>
`;
code = code.replace(/<h4 className="text-gray-400 font-medium mb-2 flex items-center justify-between">\s*<span>Transcribed Text<\/span>\s*\{isTranscribing \&\& <span className="text-xs text-indigo-400 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" \/> Extracting\.\.\.<\/span>\}\s*<\/h4>/, uiLogic);

fs.writeFileSync('src/components/LockScreen.tsx', code);
