import React, { useState, useEffect, useRef } from 'react';
import { Lock, Upload, Camera, FileWarning, CheckCircle, Sparkles, X, Loader2, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { ScheduleData, AppSettings, SavedResource } from '../types';

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
}

export function LockScreen({ schedule, settings, resources, lockEndTime, onSubmitHomework, onTimeout, getCurrentTime, onTimeOverride, timeOffset, onResetTime }: LockScreenProps) {
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

  const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);

  const handleGetAnswer = async () => {
    setIsGeneratingAnswer(true);
    setShowAnswerPopup(true);
    setAiAnswer(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.apiKey) headers['x-api-key'] = settings.apiKey;
      if (settings.apiModel) headers['x-api-model'] = settings.apiModel;
      if (settings.prompts) headers['x-custom-prompts'] = JSON.stringify(settings.prompts);

      const resourcesText = resources.filter(r => (schedule.selectedResourceIds || []).includes(r.id)).map(r => `--- ${r.title} ---\n${r.content}`).join('\n\n');

      const res = await fetch('/api/generate-answer', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          content: schedule.homeworkContent, 
          resourcesText,
          rubric: schedule.rubricContent
        })
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        if (!res.ok) {
          throw new Error(`Server error (${res.status})`);
        } else {
          throw new Error(`Unexpected response format from server.`);
        }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate answer.');
      }
      
      if (data.answer) {
        setAiAnswer(data.answer);
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
        setTranscribedText(`[OCR Failed: ${data.error || 'Unknown error'}]`);
      }
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
      onSubmitHomework(selectedFile, ocrType, transcribedText || undefined);
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-white z-50">
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
            onClick={handleGetAnswer}
            className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-xs text-indigo-300 font-bold rounded-lg transition-colors flex items-center"
          >
            <Sparkles className="w-3 h-3 mr-2" />
            Get AI Answer
          </button>
          <button 
            onClick={() => onTimeout(true)}
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
            <select
              value={ocrType}
              onChange={(e) => setOcrType(e.target.value as 'simple' | 'formatted')}
              className="bg-gray-800 text-sm text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500"
            >
              <option value="simple">Simple OCR</option>
              <option value="formatted">Formatted OCR (Tables)</option>
            </select>
          </div>
          {!previewUrl ? (
            <div 
              className="w-full h-56 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-gray-400 font-medium">Capture Handwritten Homework</p>
              <p className="text-gray-600 text-sm mt-2">Only handwritten submissions will be accepted</p>
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
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-4 right-4 bg-gray-900/80 p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
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
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
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
            <div className="px-6 py-4 border-t border-gray-800 bg-black/20 flex justify-end">
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
