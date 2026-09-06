import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, BookOpen, GraduationCap, User } from 'lucide-react';

interface OnboardingProps {
  onComplete: (role: 'student' | 'teacher' | 'just a guy') => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [termsAccepted, setTermsAccepted] = useState({
    lockWarning: false,
    aiWarning: false,
    noBypassWarning: false,
  });

  const allAccepted = Object.values(termsAccepted).every(Boolean);

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-white z-50">
        <div className="max-w-2xl w-full bg-gray-900 border border-red-900 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-20 h-20 bg-red-950 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-800">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Nuclear Warning</h1>
            <p className="text-gray-400">Read and acknowledge the Terms & Conditions before proceeding.</p>
          </div>

          <div className="space-y-4 mb-8">
            <label className="flex items-start cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={termsAccepted.lockWarning}
                  onChange={(e) => setTermsAccepted({...termsAccepted, lockWarning: e.target.checked})}
                />
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${termsAccepted.lockWarning ? 'bg-red-600 border-red-600' : 'border-gray-600 group-hover:border-red-500'}`}>
                  {termsAccepted.lockWarning && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-200">Total Device Lockdown</h3>
                <p className="text-sm text-gray-500">I understand that UNCODE will completely restrict my device access during scheduled hours. I will not be able to use distracting apps.</p>
              </div>
            </label>

            <label className="flex items-start cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={termsAccepted.aiWarning}
                  onChange={(e) => setTermsAccepted({...termsAccepted, aiWarning: e.target.checked})}
                />
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${termsAccepted.aiWarning ? 'bg-red-600 border-red-600' : 'border-gray-600 group-hover:border-red-500'}`}>
                  {termsAccepted.aiWarning && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-200">AI Evaluation Only</h3>
                <p className="text-sm text-gray-500">I understand that the only way to unlock my device early is to handwrite my homework and have an AI grade it based on my uploaded rubrics.</p>
              </div>
            </label>

            <label className="flex items-start cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={termsAccepted.noBypassWarning}
                  onChange={(e) => setTermsAccepted({...termsAccepted, noBypassWarning: e.target.checked})}
                />
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${termsAccepted.noBypassWarning ? 'bg-red-600 border-red-600' : 'border-gray-600 group-hover:border-red-500'}`}>
                  {termsAccepted.noBypassWarning && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-gray-200">No Easy Bypass</h3>
                <p className="text-sm text-gray-500">I understand that restarting the device will not bypass the lock. Only waiting for the timeout or passing the homework check will restore access.</p>
              </div>
            </label>
          </div>

          <button
            disabled={!allAccepted}
            onClick={() => setStep(2)}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl transition-colors text-lg"
          >
            I Accept the Consequences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-white z-50">
      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-2">IDENTIFICATION</h2>
        <p className="text-gray-400 text-center mb-8">Select your profile so the AI knows how strictly to grade you.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onComplete('student')}
            className="flex flex-col items-center justify-center p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:bg-gray-700 hover:border-gray-500 transition-all group"
          >
            <GraduationCap className="w-12 h-12 text-gray-400 group-hover:text-white mb-4" />
            <span className="font-bold text-lg">Student</span>
          </button>
          
          <button 
            onClick={() => onComplete('teacher')}
            className="flex flex-col items-center justify-center p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:bg-gray-700 hover:border-gray-500 transition-all group"
          >
            <BookOpen className="w-12 h-12 text-gray-400 group-hover:text-white mb-4" />
            <span className="font-bold text-lg">Teacher</span>
          </button>

          <button 
            onClick={() => onComplete('just a guy')}
            className="flex flex-col items-center justify-center p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:bg-gray-700 hover:border-gray-500 transition-all group"
          >
            <User className="w-12 h-12 text-gray-400 group-hover:text-white mb-4" />
            <span className="font-bold text-lg text-center leading-tight">Just a Guy<br/><span className="text-sm text-gray-500 font-normal">learning things</span></span>
          </button>
        </div>
      </div>
    </div>
  );
}
