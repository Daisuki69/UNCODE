import React from 'react';
import { CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { EvaluationResult as IEvaluationResult } from '../types';

interface EvaluationResultProps {
  result: IEvaluationResult;
  onRetry: () => void;
  onReset: () => void;
}

export function EvaluationResult({ result, onRetry, onReset }: EvaluationResultProps) {
  return (
    <div 
      className="min-h-full w-full flex flex-col items-center justify-start p-4 sm:p-6 flex-shrink-0"
      style={{ 
        paddingTop: 'calc(1.5rem + var(--safe-top))', 
        paddingBottom: 'calc(3rem + var(--safe-bottom))' 
      }}
    >
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 my-auto flex flex-col flex-shrink-0">
        
        <div className={`p-6 sm:p-8 flex flex-col items-center justify-center text-center ${result.passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
          {result.passed ? (
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-500 mb-3 sm:mb-4" />
          ) : (
            <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mb-3 sm:mb-4" />
          )}
          <h2 className={`text-2xl sm:text-3xl font-black ${result.passed ? 'text-emerald-900' : 'text-red-900'}`}>
            {result.passed ? 'EVALUATION PASSED' : 'EVALUATION FAILED'}
          </h2>
          <p className={`mt-2 text-sm sm:text-base font-medium ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
            {result.passed ? 'System restrictions lifted. Good job.' : 'Restrictions remain active. Your work was rejected.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Feedback</h3>
          <p className="text-gray-800 text-base sm:text-lg mb-6 leading-relaxed whitespace-pre-line">
            {result.feedback}
          </p>

          {(result.wordCount !== undefined && result.sentenceCount !== undefined) && (
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <span className="block text-2xl sm:text-3xl font-black text-gray-800">{result.wordCount}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Words</span>
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <span className="block text-2xl sm:text-3xl font-black text-gray-800">{result.sentenceCount}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sentences</span>
              </div>
            </div>
          )}

          {result.transcribedText && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Transcription</h3>
              <div className="text-gray-600 font-mono text-sm whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                {result.transcribedText}
              </div>
            </div>
          )}

          {result.passed ? (
            <button
              onClick={onReset}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              Exit to Main Screen
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
