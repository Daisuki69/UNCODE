import React, { useState, useEffect, useRef } from 'react';
import { Lock, Upload, Camera, FileWarning, CheckCircle, Sparkles, X, Loader2, RefreshCcw, Calculator, FileText, Music, Globe, MessageSquare, MonitorPlay, BookOpen, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';
import { ScheduleData, AppSettings, SavedResource } from '../types';
import { parseResource } from '../api/parseResource';
import { generateAnswer } from '../api/generateAnswer';

interface LockScreenProps {
  schedule: ScheduleData;
  settings: AppSettings;
  resources: SavedResource[];
  lockEndTime: number;
  onSubmitHomework: (file: File, ocrType: 'simple' | 'formatted', transcribedText?: string) => void;
    onTimeout: (skipped?: boolean) => void;
  getCurrentTime: () => number;
  onTimeOverride?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  timeOffset?: number;
  onResetTime?: () => void;
  onSettingsChange?: (updates: Partial<AppSettings>) => void;
}

export function LockScreen({ schedule, settings, resources, lockEndTime, onSubmitHomework, onTimeout, getCurrentTime, onTimeOverride, timeOffset, onResetTime, onSettingsChange }: LockScreenProps) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.floor((lockEndTime - getCurrentTime()) / 1000)));
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const formatForInput = (date: Date) => {
    return date.toTimeString().split(' ')[0];
  };
  
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [ocrType, setOcrType] = useState<'simple' | 'formatted'>(settings.defaultOcrType || 'simple');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(`lockscreen_data_${schedule.id}`);
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
         localStorage.removeItem(`lockscreen_data_${schedule.id}`);
      } else {
         try {
           localStorage.setItem(`lockscreen_data_${schedule.id}`, JSON.stringify(dataToSave));
         } catch(e) {
           console.warn("Storage quota exceeded, could not save image to local storage.");
         }
      }
    };

    saveData();
  }, [transcribedText, selectedFile, schedule.id]);

  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);

  const handleGetAnswer = async (force = false) => {
    setShowAnswerPopup(true);
    if (aiAnswer && !force) return;

    setIsGeneratingAnswer(true);
    setShowAnswerPopup(true);
    setAiAnswer(null);
    try {
      let resourcesText = resources.filter(r => (schedule.selectedResourceIds || []).includes(r.id)).map(r => `--- ${r.title} ---\n${r.content}`).join('\n\n');
      if ((schedule.selectedResourceIds || []).includes('ai-general-knowledge')) {
        resourcesText += '\n\n=== SYSTEM NOTE ===\nThe AI is authorized to use external general knowledge to complete this task.';
      }

      const answer = await generateAnswer({
        content: schedule.homeworkContent,
        resourcesText,
        rubric: schedule.rubricContent,
        apiKey: settings.apiKey || '',
        apiModel: settings.apiModel || 'gemini-2.0-flash',
        customPrompts: settings.prompts,
      });

      if (answer) {
        setAiAnswer(answer);
        schedule.aiAnswer = answer;
      } else {
        setAiAnswer('Error: Empty response from AI.');
      }
    } catch (err: any) {
      setAiAnswer(`Error: ${err.message}`);
    } finally {
      setIsGeneratingAnswer(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = getCurrentTime();
      const remaining = Math.max(0, Math.floor((lockEndTime - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(timer);
        localStorage.removeItem(`lockscreen_data_${schedule.id}`);
        onTimeout();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockEndTime, onTimeout, getCurrentTime]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  
  
  const runOCR = async (file: File) => {
    setIsTranscribing(true);
    setTranscribedText(null);
    try {
      const data = await parseResource({
        file,
        type: 'transcription',
        apiKey: settings.apiKey || '',
        apiModel: settings.apiModel || 'gemini-2.0-flash',
        ocrType,
        simpleOcrKey: settings.simpleOcrKey || '',
        formattedOcrKey: settings.formattedOcrKey || '',
        customPrompts: settings.prompts,
      });
      setTranscribedText(data.error ? `[OCR Failed: ${data.error}]` : data.content);
    } catch (err: any) {
      setTranscribedText(`[OCR Error: ${err.message}]`);
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


  
  const handleSubmit = () => {
    if (selectedFile) {
      // NOTE: We no longer clear localStorage here. It is cleared in App.tsx ONLY if evaluation passes.
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center p-6 text-white z-50 overflow-y-auto" style={{ paddingBottom: 'calc(3rem + var(--safe-bottom))', paddingTop: 'calc(1.5rem + var(--safe-top))' }}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
        <motion.div 
          className="h-full bg-red-600"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / (schedule.durationMinutes * 60)) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
        />
      </div>

      <div className="max-w-3xl w-full flex flex-col items-center relative">
        <div className="absolute top-0 right-0 flex gap-2">
          <button 
            onClick={() => handleGetAnswer(false)}
            className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-xs text-indigo-300 font-bold rounded-lg transition-colors flex items-center"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Get AI Answer
          </button>
          <button 
            onClick={() => { localStorage.removeItem(`lockscreen_data_${schedule.id}`); onTimeout(true); }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold rounded-lg transition-colors"
          >
            Skip Lock (Test)
          </button>
        </div>

        <Lock className="w-16 h-16 text-red-500 mb-6" />
        
        <h2 className="text-4xl font-black tracking-widest text-white mb-2">SYSTEM LOCKED</h2>
        <div className="text-6xl font-mono text-red-500 mb-2 font-light">
          {formatTime(timeLeft)}
        </div>
        <div className="flex items-center justify-center space-x-2 mb-8 bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-800">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Simulated Time:</span>
          {onTimeOverride ? (
            <>
              <input 
                type="time" 
                step="1"
                value={formatForInput(new Date(getCurrentTime()))}
                onChange={onTimeOverride}
                className="bg-transparent text-sm font-mono text-gray-300 font-bold focus:outline-none"
              />
              {(timeOffset || 0) !== 0 && (
                <button 
                  onClick={onResetTime}
                  className="ml-2 text-[10px] font-bold text-red-400 hover:text-red-300 bg-red-900/30 px-2 py-0.5 rounded uppercase"
                >
                  Reset
                </button>
              )}
            </>
          ) : (
            <span className="text-sm font-mono text-gray-300 font-bold">{new Date(getCurrentTime()).toLocaleTimeString()}</span>
          )}
        </div>

        <div className="w-full bg-gray-900 border border-red-900/50 rounded-2xl p-6 mb-8 text-left flex flex-col gap-4">
          <div>
            <h3 className="text-red-400 font-bold mb-2 uppercase text-sm tracking-widest flex items-center">
              <FileWarning className="w-4 h-4 mr-2" /> Required to Unlock
            </h3>
            <p className="text-gray-300 font-mono text-sm leading-relaxed">
              Submit a photo of your handwritten homework covering the topic below and satisfying its rubric.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-500 font-bold uppercase text-xs mb-1">Homework Context</h4>
            <div className="bg-black/40 p-4 rounded-xl border border-gray-800 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{schedule.homeworkContent}</p>
            </div>
          </div>

          <div>
            <h4 className="text-gray-500 font-bold uppercase text-xs mb-1">Grading Rubric</h4>
            <div className="bg-black/40 p-4 rounded-xl border border-red-900/30 max-h-48 overflow-y-auto">
              <p className="text-sm text-red-300 font-mono whitespace-pre-wrap">{schedule.rubricContent}</p>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4">
            <h4 className="text-gray-400 font-medium">Upload Submission</h4>
            <div className="flex gap-2">
              <select
                value={settings.apiModel || 'gemini-3.7-flash'}
                onChange={(e) => onSettingsChange?.({ apiModel: e.target.value })}
                className="bg-gray-800 text-sm text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500"
              >
                <option value="gemini-3.7-flash">Gemini 3.7 Flash</option>
                <option value="gemini-3.7-pro">Gemini 3.7 Pro</option>
                <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                <option value="gemini-3.5-pro">Gemini 3.5 Pro</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-2.0-pro">Gemini 2.0 Pro</option>
              </select>
              <select
                value={ocrType}
                onChange={(e) => setOcrType(e.target.value as 'simple' | 'formatted')}
                className="bg-gray-800 text-sm text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500"
              >
                <option value="simple">Simple OCR</option>
                <option value="formatted">Formatted OCR (Tables)</option>
              </select>
            </div>
          </div>
          {!previewUrl ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="group p-6 rounded-2xl border-2 border-dashed border-gray-700 hover:border-indigo-500 bg-gray-950/50 hover:bg-gray-900/80 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-indigo-500/10"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 flex items-center justify-center mb-3 transition-all">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="text-white font-bold text-base mb-1">Capture with Camera</span>
                <span className="text-gray-400 text-xs leading-relaxed">Take a photo of physical handwritten work</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group p-6 rounded-2xl border-2 border-dashed border-gray-700 hover:border-indigo-500 bg-gray-950/50 hover:bg-gray-900/80 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-sm hover:shadow-indigo-500/10"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 flex items-center justify-center mb-3 transition-all">
                  <Upload className="w-7 h-7" />
                </div>
                <span className="text-white font-bold text-base mb-1">Upload from Files / Gallery</span>
                <span className="text-gray-400 text-xs leading-relaxed">Choose an existing image or document</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 border border-gray-700">
                <img src={previewUrl} alt="Homework Preview" className="object-cover w-full h-full" />
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setTranscribedText(null);
                    if (cameraInputRef.current) cameraInputRef.current.value = '';
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-4 right-4 bg-gray-900/80 p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full mb-6 flex flex-col">
                
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

                <Upload className="w-5 h-5 mr-2" />
                Submit for AI Evaluation
              </button>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={cameraInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
        
        {(settings.allowedApps && settings.allowedApps.length > 0) && (
          <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-8">
            <h4 className="text-gray-500 font-bold uppercase text-xs mb-4 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 mr-2" /> Allowed Applications During Lock
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {settings.allowedApps.map(app => {
                const iconMap: Record<string, React.ElementType> = {
                  'Calculator': Calculator,
                  'FileText': FileText,
                  'Music': Music,
                  'Globe': Globe,
                  'BookOpen': BookOpen,
                  'MessageSquare': MessageSquare,
                  'MonitorPlay': MonitorPlay
                };
                const RenderIcon = iconMap[app.iconName] || LayoutGrid;
                
                return (
                  <div key={app.id} className="flex items-center bg-black/40 border border-gray-800 rounded-xl py-2 px-4 shadow-sm">
                    {app.iconBase64 ? (
                      <img src={`data:image/png;base64,${app.iconBase64}`} alt={app.name} className="w-5 h-5 mr-2 object-cover rounded-sm" />
                    ) : (
                      <RenderIcon className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm font-semibold text-gray-300">{app.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showAnswerPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
                AI Generated Answer
              </h2>
              <button onClick={() => setShowAnswerPopup(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300">
              {isGeneratingAnswer ? (
                <div className="flex flex-col items-center justify-center py-12 text-indigo-400">
                  <Loader2 className="w-8 h-8 mb-4 animate-spin" />
                  <p>Generating answer...</p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{aiAnswer}</div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-800 bg-black/20 flex justify-end space-x-3">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
