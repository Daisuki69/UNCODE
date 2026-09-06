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
    <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center p-6 z-50">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className={`p-8 flex flex-col items-center justify-center text-center ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
          {result.passed ? (
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500 mb-4" />
          )}
          <h2 className={`text-3xl font-black ${result.passed ? 'text-green-900' : 'text-red-900'}`}>
            {result.passed ? 'EVALUATION PASSED' : 'EVALUATION FAILED'}
          </h2>
          <p className={`mt-2 ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
            {result.passed ? 'System restrictions lifted. Good job.' : 'Restrictions remain active. Your work was rejected.'}
          </p>
        </div>

        <div className="p-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">AI Feedback</h3>
          <p className="text-gray-800 text-lg mb-8 leading-relaxed">
            {result.feedback}
          </p>

          {(result.wordCount !== undefined && result.sentenceCount !== undefined) && (
            <div className="flex gap-4 mb-8">
              <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <span className="block text-3xl font-black text-gray-800">{result.wordCount}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Words</span>
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                <span className="block text-3xl font-black text-gray-800">{result.sentenceCount}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sentences</span>
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Transcription</h3>
            <div className="text-gray-600 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
              {result.transcribedText}
            </div>
          </div>

          {result.passed ? (
            <button
              onClick={onReset}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors"
            >
              Exit to Main Screen
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center"
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
