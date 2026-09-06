import React, { useState } from 'react';
import { FileText, X, ChevronRight, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { CompletedHomework } from '../types';

interface HomeworksPageProps {
  homeworks: CompletedHomework[];
  onBack: () => void;
  onClear: () => void;
}

export function HomeworksPage({ homeworks, onBack, onClear }: HomeworksPageProps) {
  const [selectedHomework, setSelectedHomework] = useState<CompletedHomework | null>(null);

  return (
    <div className="flex-1 flex items-center justify-center p-4 h-full">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold flex items-center text-gray-800">
            {selectedHomework ? (
              <button 
                onClick={() => setSelectedHomework(null)}
                className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mr-3"
              >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back
              </button>
            ) : (
              <><FileText className="w-6 h-6 mr-2 text-indigo-500" /> Homeworks Completed</>
            )}
          </h2>
          <div className="flex gap-2">
            {!selectedHomework && homeworks.length > 0 && (
              <button onClick={onClear} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center border border-red-100"> 
                 Clear All
              </button>
            )}
            <button onClick={onBack} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {!selectedHomework ? (
            <div className="space-y-3">
              {homeworks.length === 0 ? (
                <div className="text-center text-gray-500 py-12 flex flex-col items-center">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <p>No completed homeworks yet.</p>
                </div>
              ) : (
                homeworks.map(hw => (
                  <button 
                    key={hw.id}
                    onClick={() => setSelectedHomework(hw)}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-left group"
                  >
                    <div className="flex items-center">
                      {hw.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mr-3" />
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900">{hw.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(hw.timestamp).toLocaleDateString()} at {new Date(hw.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-xl text-gray-900">{selectedHomework.title}</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${selectedHomework.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedHomework.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Original Assignment</h4>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 whitespace-pre-wrap text-gray-700 font-serif text-sm">
                    {selectedHomework.homeworkContent}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Rubric Used</h4>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 whitespace-pre-wrap text-gray-700 text-sm">
                    {selectedHomework.rubricContent}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Submitted Work (Transcript)</h4>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 whitespace-pre-wrap text-gray-800 font-serif leading-relaxed">
                    {selectedHomework.transcribedText}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">AI Evaluation Feedback</h4>
                  <div className={`p-4 rounded-xl border whitespace-pre-wrap text-sm ${selectedHomework.passed ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-red-50 border-red-100 text-red-900'}`}>
                    {selectedHomework.feedback}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
