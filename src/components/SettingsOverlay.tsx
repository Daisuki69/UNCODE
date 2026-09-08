import React, { useState, useEffect } from 'react';
import { X, Key, Save, Trash2, Cpu, FileText, Wand2, RefreshCw, ArrowLeft, Clock, Activity } from 'lucide-react';
import { AppSettings, LogEntry } from '../types';
import { defaultPrompts as staticDefaultPrompts } from '../../defaultPrompts';

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
      const res = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-api-model': apiModel
        },
        body: JSON.stringify({ promptText: value })
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
        throw new Error(data.error || 'Failed to refine prompt.');
      }

      if (data.refined) {
        const newPrompts = { ...customPrompts, [key]: data.refined };
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
              <div className="flex space-x-3 mt-8">
                <button
                  onClick={handleClearGeneral}
                  className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl flex items-center transition-colors flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset
                </button>
                <button
                  onClick={handleSaveGeneral}
                  className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg flex items-center transition-colors flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
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
