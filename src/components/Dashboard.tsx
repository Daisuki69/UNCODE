import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, Trash2, Plus, Sparkles, Pencil, Upload, Loader2, Settings, ShieldAlert, X, GitMerge, FileText } from 'lucide-react';
import { AppSettings, SavedResource, ScheduleData } from '../types';

interface DashboardProps {
  settings: AppSettings;
  timeUntilLock: number | null;
  nextActivationDate: Date | null;
  onCreateSchedule: () => void;
  onClearSchedule: (id?: string) => void;
  onOpenSettings: () => void;
  showError: (msg: string) => void;
  resources: SavedResource[];
  onAddResource: (title: string, content: string) => void;
  onUpdateResource: (id: string, title: string, content: string) => void;
  onRemoveResource: (id: string) => void;
  onCombineResources: (id1: string, id2: string) => void;
  onViewRubric: (schedule: ScheduleData) => void;
  onOpenLogs: () => void;
  onResourceEditStateChange?: (isEditing: boolean) => void;
  displayTime: Date;
  timeOffset: number;
  onTimeOverride: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetTime: () => void;
}

const pageVariants = {
  initial: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? '100%' : '-100%'
  }),
  animate: { opacity: 1, x: 0 },
  exit: (direction: 'forward' | 'backward') => ({
    opacity: 0,
    x: direction === 'forward' ? '-100%' : '100%'
  })
};
export function Dashboard({ 
  settings, 
  timeUntilLock,
  nextActivationDate,
  onCreateSchedule,
  onClearSchedule,
  onOpenSettings,
  showError,
  resources,
  onAddResource,
  onUpdateResource,
  onRemoveResource,
  onCombineResources,
  onViewRubric,
  onOpenLogs,
  onResourceEditStateChange,
  displayTime,
  timeOffset,
  onTimeOverride,
  onResetTime
}: DashboardProps) {
  
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [editingResource, setEditingResource] = useState<SavedResource | 'new' | null>(null);
  const [mergingResource, setMergingResource] = useState<SavedResource | null>(null);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResContent, setNewResContent] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [ocrType, setOcrType] = useState<'simple' | 'formatted'>(settings.defaultOcrType || 'simple');
  const [isDecluttering, setIsDecluttering] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const formatForInput = useCallback((d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }, []);

  useEffect(() => {
    if (onResourceEditStateChange) {
      onResourceEditStateChange(editingResource !== null);
    }
  }, [editingResource, onResourceEditStateChange]);


  const closeResourceEditor = useCallback(() => {
    setNavDirection('backward');
    setEditingResource(null);
    setIsConfirmingDelete(false);
  }, []);

  const openNewResource = useCallback(() => {
    setNavDirection('forward');
    setEditingResource('new');
    setNewResTitle('');
    setNewResContent('');
  }, []);

  const openEditResource = useCallback((res: SavedResource) => {
    setNavDirection('forward');
    setEditingResource(res);
    setNewResTitle(res.title);
    setNewResContent(res.content);
  }, []);

  
  const handleSaveAndCleanup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newResTitle.trim();
    const trimmedContent = newResContent.trim();
    if (!trimmedTitle && !trimmedContent) {
      return;
    }

    setIsDecluttering(true);
    let finalTitle = trimmedTitle;
    let finalContent = newResContent;

    try {
      if (settings.apiKey) {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        headers['x-api-key'] = settings.apiKey;
        if (settings.apiModel) headers['x-api-model'] = settings.apiModel;
        if (settings.prompts) headers['x-custom-prompts'] = JSON.stringify(settings.prompts);
        if (settings.simpleOcrKey) headers['x-simple-ocr-key'] = settings.simpleOcrKey;
        if (settings.formattedOcrKey) headers['x-formatted-ocr-key'] = settings.formattedOcrKey;
        headers['x-ocr-type'] = ocrType;

        const res = await fetch('/api/declutter-resource', {
          method: 'POST',
          headers,
          body: JSON.stringify({ title: trimmedTitle, content: trimmedContent })
        });

        const contentType = res.headers.get('content-type') || '';
        const rawText = contentType.includes('application/json') ? await res.text() : '';
        const data = contentType.includes('application/json') ? JSON.parse(rawText || '{}') : null;

        if (res.ok && data && !data.error) {
          if (typeof data.title === 'string' && data.title.trim()) finalTitle = data.title.trim();
          if (typeof data.content === 'string' && data.content.trim()) finalContent = data.content;
        } else if (res.status === 404 || res.status === 500) {
          console.warn('Declutter service unavailable; preserving the entered title.');
        } else if (data?.error) {
          console.error('Declutter AI error', data.error);
        }
      }
    } catch (err: any) {
      console.error('Error in declutter:', err);
    } finally {
      setIsDecluttering(false);
    }

    const baseTitle = finalTitle.trim();
    const preservedTitle = baseTitle || (editingResource && editingResource !== 'new' ? editingResource.title.trim() : '');
    if (!preservedTitle) {
      showError('A proper resource title is required before saving. Please add one or try a document upload that generates a title.');
      return;
    }

    if (editingResource === 'new') {
      onAddResource(preservedTitle, finalContent);
    } else if (editingResource) {
      onUpdateResource(editingResource.id, preservedTitle, finalContent);
    }

    closeResourceEditor();
  }, [closeResourceEditor, editingResource, newResContent, newResTitle, ocrType, onAddResource, onUpdateResource, settings.apiKey, settings.apiModel, settings.formattedOcrKey, settings.prompts, settings.simpleOcrKey, showError]);


  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', 'homework');

    try {
      const headers: Record<string, string> = {};
      if (settings.apiKey) headers['x-api-key'] = settings.apiKey;
      if (settings.apiModel) headers['x-api-model'] = settings.apiModel;
      if (settings.prompts) headers['x-custom-prompts'] = JSON.stringify(settings.prompts);
      if (settings.simpleOcrKey) headers['x-simple-ocr-key'] = settings.simpleOcrKey;
      if (settings.formattedOcrKey) headers['x-formatted-ocr-key'] = settings.formattedOcrKey;
      headers['x-ocr-type'] = ocrType;

      const res = await fetch('/api/parse-resource', {
        method: 'POST',
        headers,
        body: formData
      });

      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        if (res.status === 413) {
          throw new Error('File is too large. Please upload a smaller file (under 30MB).');
        }
        if (res.status === 404) {
          throw new Error('The resource parser is unavailable right now. Please restart the app and try again.');
        }
        throw new Error(text ? text.substring(0, 120) : `Server returned unexpected response (${res.status}).`);
      }

      if (!res.ok || data.error) {
        if (res.status === 401 || (data.error && typeof data.error === 'string' && data.error.includes('UNAUTHENTICATED'))) {
          throw new Error('Invalid API Key. Please update your API key in the Dashboard Settings.');
        }
        if (res.status === 404) {
          throw new Error('The resource parser is unavailable right now. Please restart the app and try again.');
        }
        throw new Error(data.error || res.statusText);
      }

      setNewResContent(data.content);
    } catch (err: any) {
      showError(`Failed to parse document: ${err.message}`);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [ocrType, settings.apiKey, settings.apiModel, settings.formattedOcrKey, settings.prompts, settings.simpleOcrKey, showError]);

  const formatTimeLeft = useCallback((seconds: number | null) => {
    if (seconds === null) return '--:--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const format12Hour = useCallback((time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  }, []);

  const schedules = useMemo(() => settings.schedules || [], [settings.schedules]);
  const activeSchedules = useMemo(() => schedules.filter(s => s.isActive), [schedules]);
  const canCreateSchedule = Boolean(settings.apiKey && (settings.simpleOcrKey || settings.formattedOcrKey));

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden">
      <AnimatePresence initial={false} custom={navDirection}>
        {editingResource ? (
          <motion.div
            key="edit-resource"
            custom={navDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-4xl mx-auto w-full p-6 flex flex-col min-h-[calc(100vh-80px)] absolute inset-0 bg-gray-50"
          >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">
            {editingResource === 'new' ? 'Add New Resource' : 'Edit Resource'}
          </h2>
          <button onClick={() => { setNavDirection('backward'); setEditingResource(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSaveAndCleanup} className="flex-1 flex flex-col gap-6 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          {editingResource === 'new' && (
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="text/plain, image/*, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden" 
              />
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-700">Image OCR Type:</span>
                <select
                  value={ocrType}
                  onChange={(e) => setOcrType(e.target.value as 'simple' | 'formatted')}
                  className="bg-gray-50 text-sm text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-400 font-medium"
                >
                  <option value="simple">Simple OCR</option>
                  <option value="formatted">Formatted OCR (Tables)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isParsing}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                {isParsing ? (
                  <Loader2 className="w-8 h-8 mb-2 animate-spin text-gray-400" />
                ) : (
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                )}
                <span className="font-bold text-gray-700">{isParsing ? 'Parsing document...' : 'Upload File'}</span>
                <span className="text-sm text-gray-400 mt-1">DOCX, PNG, JPG, TXT</span>
              </button>
              <div className="relative mt-8 mb-4 text-center">
                <span className="px-2 bg-white text-xs font-bold text-gray-400 uppercase tracking-wider">OR ENTER MANUALLY</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Resource Title</label>
            <input
              type="text"
              placeholder="e.g. History Chapter 4"
              value={newResTitle}
              onChange={(e) => setNewResTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 font-bold"
              required
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
            <textarea
              placeholder="Paste or type content here..."
              value={newResContent}
              onChange={(e) => setNewResContent(e.target.value)}
              className="flex-1 min-h-[300px] w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 resize-none font-mono text-sm leading-relaxed"
              required
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              {editingResource !== 'new' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMergingResource(editingResource)}
                    className="px-6 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-xl transition-colors flex items-center"
                  >
                    <GitMerge className="w-5 h-5 mr-2" />
                    Combine with...
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-6 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-colors flex items-center"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Resource
                  </button>
                </>
              )}
            </div>
            <div className="flex space-x-4">
              <button 
                type="button" 
                onClick={closeResourceEditor}
                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              
              <button 
                type="button"
                onClick={handleSaveAndCleanup}
                disabled={isDecluttering || (!newResTitle.trim() && !newResContent.trim())}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center disabled:opacity-50"
              >
                {isDecluttering ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> Save & Clean Up</>
                )}
              </button>

            </div>
          </div>
        </form>

        {/* Combine Resource Modal */}
        <AnimatePresence>{mergingResource && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <GitMerge className="w-6 h-6 mr-2 text-indigo-500" />
                  Combine "{mergingResource.title}" with...
                </h3>
                <button onClick={() => setMergingResource(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-3">
                  {resources.filter(r => r.id !== mergingResource.id).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No other resources available to combine with.</p>
                  ) : (
                    resources.filter(r => r.id !== mergingResource.id).map(r => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onCombineResources(mergingResource.id, r.id);
                          setMergingResource(null);
                          closeResourceEditor();
                        }}
                        className="p-4 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl flex flex-col text-left transition-colors"
                      >
                        <span className="font-bold text-gray-900">{r.title}</span>
                        <span className="text-xs text-gray-500 mt-1 line-clamp-1">{r.content}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>{isConfirmingDelete && editingResource !== 'new' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Delete Resource?</h3>
              <p className="text-gray-500 mb-8 text-sm">Are you sure you want to delete this resource? This action cannot be undone.</p>
              
              <div className="w-full flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    onRemoveResource(editingResource.id);
                    closeResourceEditor();
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="main-dashboard"
            custom={navDirection}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="max-w-5xl mx-auto w-full p-6 absolute inset-0 overflow-y-auto"
          >
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-2">

          <h1 className="text-2xl font-black tracking-tighter text-gray-900">UNCODE</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1 border border-gray-200" title="Click to simulate a different time">
              <span className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wider">Simulated Time:</span>
              <input 
                type="time" 
                step="1"
                value={formatForInput(displayTime)}
                onChange={onTimeOverride}
                className="bg-transparent text-sm font-mono text-gray-900 font-bold focus:outline-none"
              />
              {timeOffset !== 0 && (
                <button 
                  onClick={onResetTime}
                  className="ml-2 text-xs font-bold text-red-500 hover:text-red-700 bg-red-100 px-2 py-0.5 rounded"
                >
                  Reset
                </button>
              )}
            </div>
            <button
              onClick={onOpenLogs}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
              title="Homeworks Completed"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

      {activeSchedules.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[200px]">
          <h2 className="text-xl font-black text-gray-900 mb-2">NO ACTIVE SCHEDULES</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
            Nothing has been scheduled yet. Create a schedule to define your homework and when the lockdown protocol should activate.
          </p>
          {(!settings.simpleOcrKey && !settings.formattedOcrKey) && (
            <div className="mb-2 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-start text-left">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mr-3 mt-0.5" />
              <div>
                <strong className="block font-bold mb-1">OCR API Key Required</strong>
                You must provide an OCR API Key (Simple or Formatted) in Settings to extract text from images.
              </div>
            </div>
          )}
          {!settings.apiKey && (
            <div className="mb-6 max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium flex items-start text-left">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mr-3 mt-0.5" />
              <div>
                <strong className="block font-bold mb-1">Gemini API Key Required</strong>
                You must provide your own Gemini API key to run this app. Click the Settings gear icon (top right) to add it before proceeding.
              </div>
            </div>
          )}
          <button
            disabled={!canCreateSchedule}
            onClick={onCreateSchedule}
            className={`px-6 py-3 font-bold rounded-xl shadow-lg transition-all flex items-center ${
              canCreateSchedule
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Schedule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Clock className="w-32 h-32" />
              </div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Next Activation</h2>
              <div className="text-4xl font-mono font-light text-red-500 mb-2">
                {formatTimeLeft(timeUntilLock)}
              </div>
              <p className="text-gray-400 text-sm mb-6">
                {nextActivationDate 
                  ? `Scheduled for ${nextActivationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                  : 'Scheduling...'}
              </p>

              <button
                disabled={!settings.apiKey}
                onClick={onCreateSchedule}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center text-sm disabled:opacity-50 mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Schedule
              </button>
            </div>
          </div>

          {/* Right Column: Schedule Details */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-gray-900 flex items-center mb-4">
              <Clock className="w-6 h-6 mr-2 text-gray-500" />
              Active Schedules
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {activeSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative group">
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => onClearSchedule(schedule.id)}
                      className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                      title="Cancel Schedule"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-start mb-4 pr-12">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                      {schedule.title || 'Homework Session'}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 mb-4 text-sm font-bold text-gray-600">
                    <div className="px-3 py-1 bg-gray-100 rounded-lg flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {format12Hour(schedule.activationTime)}
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded-lg flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {schedule.durationMinutes} Min
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Homework Content</h4>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 line-clamp-3">
                      <p className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                        {schedule.homeworkContent}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                      {schedule.rubricMode === 'ai' ? <Sparkles className="w-4 h-4 mr-1 text-red-500" /> : <Pencil className="w-4 h-4 mr-1 text-gray-500" />}
                      Rubric
                    </h4>
                    <div 
                      onClick={() => onViewRubric(schedule)}
                      className="bg-red-50 p-3 rounded-xl border border-red-100 cursor-pointer hover:bg-red-100 transition-colors"
                      title="Click to view or edit full rubric"
                    >
                      <p className="text-xs text-red-900 font-mono leading-relaxed whitespace-pre-wrap line-clamp-3">
                        {schedule.rubricContent}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Resource Library */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-gray-500" />
            Saved Resource Library
          </h2>
          <button
            onClick={openNewResource}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </button>
        </div>

        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold text-gray-500 mb-1">Your library is empty</p>
            <p className="text-sm">Save syllabuses or reading materials here to quickly use them in schedules.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 max-h-[300px] overflow-y-auto pr-2">
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
              </div>
            ))}
          </div>
        )}
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
