import React, { useState } from 'react';
import { ScheduleData, SavedResource } from '../types';
import { ArrowLeft, Sparkles, Pencil, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditRubricProps {
  schedule: ScheduleData;
  resources: SavedResource[];
  apiKey?: string;
  apiModel?: string;
  role: string;
  onSave: (schedule: ScheduleData) => void;
  onCancel: () => void;
  showError: (msg: string) => void;
}

export function EditRubric({ schedule, resources, apiKey, apiModel, role, onSave, onCancel, showError }: EditRubricProps) {
  const [rubricContent, setRubricContent] = useState(schedule.rubricContent);
  const [isGeneratingRubric, setIsGeneratingRubric] = useState(false);
  const [isRefiningRubric, setIsRefiningRubric] = useState(false);
  const [activePopup, setActivePopup] = useState<'none' | 'user'>('none');
  const [tempRubric, setTempRubric] = useState('');

  const handleGenerateRubric = async () => {
    setIsGeneratingRubric(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;
      if (apiModel) headers['x-api-model'] = apiModel;

      // In a real app we'd map back which resources were selected for this schedule,
      // but for this simple version we'll just send all of them if that's what was provided,
      // or we can prompt to select. For simplicity, we just use all resources, as the API limits might hit.
      // Wait, let's just send all resources to keep it simple, or maybe none if it was empty.
      const resourcesText = resources.filter(r => schedule.selectedResourceIds.includes(r.id)).map(r => `=== ${r.title} ===\n${r.content}`).join('\n\n');
      
      const res = await fetch('/api/build-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ content: schedule.homeworkContent, resourcesText, userDraft: "None" })
      });
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Server returned non-JSON: ${rawText.substring(0, 100)}`);
      }
      if (!res.ok || data.error) {
        if (res.status === 401 || (data.error && typeof data.error === 'string' && data.error.includes('UNAUTHENTICATED'))) {
          throw new Error('Invalid API Key. Please update your API key in the Dashboard Settings.');
        }
        throw new Error(data.error || res.statusText);
      }
      setRubricContent(data.rubric);
    } catch (err: any) {
      showError(`Failed to generate rubric: ${err.message}`);
    } finally {
      setIsGeneratingRubric(false);
    }
  };

  const handleRefineRubric = async () => {
    if (!tempRubric.trim()) {
      showError("Please enter a base rubric first.");
      return;
    }

    setIsRefiningRubric(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) headers['x-api-key'] = apiKey;
      if (apiModel) headers['x-api-model'] = apiModel;
      
      const resourcesText = resources.filter(r => schedule.selectedResourceIds.includes(r.id)).map(r => r.content).join('\n\n');

      const res = await fetch('/api/build-rubric', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          content: schedule.homeworkContent,
          resourcesText,
          userDraft: tempRubric
        })
      });
      
      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        throw new Error(`Server returned non-JSON: ${rawText.substring(0, 100)}`);
      }
      if (!res.ok || data.error) throw new Error(data.error || res.statusText);
      
      setRubricContent(data.rubric);
      setActivePopup('none');
      setTempRubric('');
    } catch (err: any) {
      showError(`Failed to refine rubric: ${err.message}`);
    } finally {
      setIsRefiningRubric(false);
    }
  };

  const handleSave = () => {
    if (!rubricContent.trim()) {
      showError('Rubric cannot be empty.');
      return;
    }
    onSave({
      ...schedule,
      rubricContent
    });
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 h-full flex flex-col relative">
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-4 text-gray-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-black text-gray-900 uppercase">Edit Rubric</h2>
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
          
          {/* AI Tools Column */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-sm mb-2">AI Assistants</h3>
            
            <button
              onClick={handleGenerateRubric}
              disabled={isGeneratingRubric}
              className="w-full p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 flex flex-col items-center justify-center transition-colors text-red-700 font-bold disabled:opacity-50"
            >
              {isGeneratingRubric ? <Loader2 className="w-6 h-6 mb-2 animate-spin" /> : <Sparkles className="w-6 h-6 mb-2" />}
              {isGeneratingRubric ? 'Generating...' : 'Let AI Generate Rubric'}
              <span className="text-xs font-normal text-red-600 mt-1 text-center">Based on homework details</span>
            </button>
            
            <button
              onClick={() => { setTempRubric(''); setActivePopup('user'); }}
              className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center transition-colors text-gray-700 font-bold"
            >
              <Pencil className="w-6 h-6 mb-2" />
              User defined + AI Generated rubric
              <span className="text-xs font-normal text-gray-500 mt-1 text-center">AI will format and combine it</span>
            </button>

          </div>

          {/* Editor Column */}
          <div className="w-full md:w-2/3 flex flex-col h-full overflow-hidden">
            <h3 className="font-bold text-gray-800 uppercase tracking-widest text-sm mb-4">Rubric Content</h3>
            <textarea
              className="flex-1 w-full p-6 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 resize-none font-mono text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 text-gray-800"
              value={rubricContent}
              onChange={(e) => setRubricContent(e.target.value)}
              placeholder="Your rubric here..."
            />
          </div>

        </div>

        <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
          <button 
            onClick={handleSave} 
            className="px-8 py-3 font-bold text-white bg-gray-900 hover:bg-black rounded-xl flex items-center transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
        </div>

      </div>

      {/* Popup Modal */}
      {activePopup !== 'none' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-lg flex flex-col"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Enter Your Rubric (AI will refine)
            </h3>
            <p className="text-gray-500 text-sm mb-4">Type your grading criteria here. AI will clean it up.</p>
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-xl resize-none font-mono text-sm mb-6 focus:ring-2 focus:ring-red-500"
              placeholder="E.g. Must include 3 references, must be 1 page long..."
              value={tempRubric}
              onChange={e => setTempRubric(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setActivePopup('none')} className="px-6 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={handleRefineRubric}
                disabled={isRefiningRubric}
                className="px-6 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center disabled:opacity-50 transition-colors"
              >
                {isRefiningRubric ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isRefiningRubric ? 'Processing...' : 'Refine & Apply'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
