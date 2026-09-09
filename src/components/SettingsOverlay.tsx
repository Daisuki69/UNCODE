import React, { useState, useEffect } from 'react';
import { X, Key, Save, Trash2, Cpu, FileText, Wand2, RefreshCw, ArrowLeft, Clock, Activity } from 'lucide-react';
import { AppSettings, LogEntry, SavedResource } from '../types';
import { defaultPrompts as staticDefaultPrompts } from '../../defaultPrompts';
import { refinePrompt } from '../api/refinePrompt';
import { loadData, saveData } from '../storage';
import { exportBackup } from '../systemBridge';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

interface SettingsOverlayProps {
  settings: AppSettings;
  logs: LogEntry[];
  onSave: (updates: Partial<AppSettings>) => void;
  onClearLogs: () => void;
  onClose: () => void;
}

export function SettingsOverlay({ settings, logs, onSave, onClearLogs, onClose }: SettingsOverlayProps) {
  const hasActiveSchedule = settings.schedules?.some(s => s.isActive) || false;
  const [activeTab, setActiveTab] = useState<'general' | 'prompts' | 'logs'>('general');
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [apiModel, setApiModel] = useState(settings.apiModel || 'gemini-3.7-flash');
  const [simpleOcrKey, setSimpleOcrKey] = useState(settings.simpleOcrKey || '');
  const [formattedOcrKey, setFormattedOcrKey] = useState(settings.formattedOcrKey || '');
  const [uiScale, setUiScale] = useState(settings.uiScale || 100);
  
  const [defaultPrompts, setDefaultPrompts] = useState<Record<string, string>>({});
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>(settings.prompts || {});
  const [refiningKey, setRefiningKey] = useState<string | null>(null);

  useEffect(() => {
    // Load directly from imported file for static/Vercel environments
    setDefaultPrompts(staticDefaultPrompts);
  }, []);

  const handleSaveGeneral = () => {
    onSave({ 
      apiKey: apiKey.trim() || undefined,
      apiModel: apiModel.trim() || 'gemini-3.7-flash',
      simpleOcrKey: simpleOcrKey.trim() || undefined,
      formattedOcrKey: formattedOcrKey.trim() || undefined,
      uiScale: uiScale
    });
  };

  const handleClearGeneral = () => {
    setApiKey('');
    setApiModel('gemini-3.7-flash');
    setSimpleOcrKey('');
    setFormattedOcrKey('');
    onSave({ apiKey: undefined, apiModel: 'gemini-3.7-flash', simpleOcrKey: undefined, formattedOcrKey: undefined });
  };

  const handleExport = async () => {
    try {
      const allData = {
        settings: await loadData<AppSettings>('studom_settings', settings),
        resources: await loadData<SavedResource[]>('studom_resources', []),
        logs: await loadData<LogEntry[]>('studom_logs', []),
        completedHomeworks: await loadData<any[]>('studom_completed_homeworks', []),
        timeOffset: await loadData<number>('studom_timeOffset', 0)
      };
      
      const jsonString = JSON.stringify(allData, null, 2);
      const tempFileName = `temp_uncode_backup_${Date.now()}.json`;
      const defaultName = `uncode_backup_${new Date().toISOString().slice(0,10)}.json`;

      // Write to internal cache
      await Filesystem.writeFile({
        path: tempFileName,
        data: jsonString,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });

      // Hand off to native SAF picker
      await exportBackup(tempFileName, defaultName);
    } catch (err) {
      console.error(err);
      alert("Failed to export data.");
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e2) => {
        try {
          const text = e2.target?.result as string;
          const data = JSON.parse(text);
          if (data.settings) await saveData('studom_settings', data.settings);
          if (data.resources) await saveData('studom_resources', data.resources);
          if (data.logs) await saveData('studom_logs', data.logs);
          if (data.completedHomeworks) await saveData('studom_completed_homeworks', data.completedHomeworks);
          if (data.timeOffset !== undefined) await saveData('studom_timeOffset', data.timeOffset);
          
          alert("Import successful! The app will now reload.");
          window.location.reload();
        } catch (err) {
          alert("Failed to parse JSON backup.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handlePromptChange = (key: string, value: string) => {
    setCustomPrompts(prev => ({ ...prev, [key]: value }));
  };

  const handleResetPrompt = (key: string) => {
    setCustomPrompts(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleResetAllPrompts = () => {
    setCustomPrompts({});
    onSave({ prompts: undefined });
  };

  const handleRefineAndSaveSingle = async (key: string) => {
    const value = customPrompts[key];
    if (!value || !value.trim() || value === defaultPrompts[key]) return;

    setRefiningKey(key);
    try {
      const refined = await refinePrompt({
        promptText: value,
        apiKey,
        apiModel,
      });

      if (refined) {
        const newPrompts = { ...customPrompts, [key]: refined };
        setCustomPrompts(newPrompts);
        onSave({ prompts: newPrompts });
      } else {
        throw new Error('Refined prompt is empty.');
      }
    } catch (e: any) {
      console.error('Failed to refine prompt', key, e);
      alert('Failed to refine prompt: ' + (e.message || 'Unknown error'));
    } finally {
      setRefiningKey(null);
    }
  };

  const handleSaveAllPrompts = () => {
    const cleanedPrompts: Record<string, string> = {};
    for (const [key, value] of Object.entries(customPrompts) as [string, string][]) {
      if (value && value.trim() && value !== defaultPrompts[key]) {
        cleanedPrompts[key] = value;
      }
    }
    setCustomPrompts(cleanedPrompts);
    onSave({ prompts: Object.keys(cleanedPrompts).length > 0 ? cleanedPrompts : undefined });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 h-full">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-3 py-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg flex items-center font-bold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`text-sm font-bold flex items-center px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Key className="w-4 h-4 mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`text-sm font-bold flex items-center px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'prompts' ? 'bg-gray-200 text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              AI Prompts
            </button>
          </div>
          <div className="w-16"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="max-w-3xl mx-auto">
              {hasActiveSchedule && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex flex-col shadow-sm">
                  <span className="font-bold uppercase tracking-wider mb-1 flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    Keys Locked
                  </span>
                  <span>You cannot modify API keys while a schedule is active. Please complete or cancel your active schedule first.</span>
                </div>
              )}
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Configure your API credentials and model for standard evaluation flows.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={hasActiveSchedule}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 font-mono text-sm mb-2"
                />
                {settings.apiKey && (
                  <p className="text-xs text-green-600 font-bold flex items-center">
                    ✓ Custom API key is currently active
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center">
                  <Cpu className="w-4 h-4 mr-1" /> AI Model
                </label>
                <select
                  value={apiModel}
                  onChange={(e) => setApiModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-sm mb-2"
                >
                  <optgroup label="Standard fast reasoning models">
                    <option value="gemini-3.7-flash">gemini-3.7-flash</option>
                    <option value="gemini-3.6-flash">gemini-3.6-flash</option>
                    <option value="gemini-3.5-flash">gemini-3.5-flash</option>
                  </optgroup>
                  <optgroup label="Cost-effective, high-throughput models">
                    <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite</option>
                    <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                  </optgroup>
                  <optgroup label="Advanced problem-solving models">
                    <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview</option>
                    <option value="gemini-3-pro-preview">gemini-3-pro-preview</option>
                    <option value="gemini-3-flash-preview">gemini-3-flash-preview</option>
                  </optgroup>
                </select>
              </div>
              <div className="mb-6 border-t border-gray-100 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center">
                  Simple OCR API Key
                </label>
                <input
                  type="password"
                  value={simpleOcrKey}
                  onChange={(e) => setSimpleOcrKey(e.target.value)}
                  disabled={hasActiveSchedule}
                  placeholder="Paste your OCR simple key here"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-sm mb-2"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center">
                  Formatted OCR API Key
                </label>
                <input
                  type="password"
                  value={formattedOcrKey}
                  onChange={(e) => setFormattedOcrKey(e.target.value)}
                  disabled={hasActiveSchedule}
                  placeholder="Paste your OCR formatted key here"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 text-sm mb-2"
                />
              </div>

              
              <div className="mb-8 border-t border-gray-200 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex justify-between">
                  <span>UI Zoom Scale</span>
                  <span className="text-gray-500">{uiScale}%</span>
                </label>
                <p className="text-xs text-gray-500 mb-4">Adjust the slider to test different UI sizes. Click save to apply globally.</p>
                <input 
                  type="range" 
                  min="50" 
                  max="150" 
                  value={uiScale} 
                  onChange={e => setUiScale(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleClearGeneral}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear
                  </button>
                  <button
                    onClick={handleSaveGeneral}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Data Management</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={handleExport}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-bold transition-colors border border-gray-200"
                    >
                      Export Backup
                    </button>
                    <button
                      onClick={handleImport}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-bold transition-colors border border-gray-200"
                    >
                      Import Backup
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Exports everything including your massive resources, schedules, and logs into a single .json file.
                  </p>
                </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                  View the system prompts used across the application. These prompts are hardcoded and cannot be modified from the UI.
                </p>
              </div>
              
              <div className="space-y-8">
                {Object.keys(defaultPrompts).map(key => (
                  <div key={key} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800 text-sm font-mono">{key}</h3>
                    </div>
                    <textarea
                      readOnly
                      value={defaultPrompts[key]}
                      className="w-full h-48 p-4 text-xs font-mono text-gray-700 bg-white resize-none focus:outline-none focus:ring-0 cursor-text"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
