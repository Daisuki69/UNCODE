import React, { useState } from 'react';
import { Clock, BookOpen, ShieldAlert } from 'lucide-react';

interface SetupFormProps {
  onStartLock: (resources: string, durationMinutes: number) => void;
}

export function SetupForm({ onStartLock }: SetupFormProps) {
  const [resources, setResources] = useState('');
  const [duration, setDuration] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resources.trim()) {
      alert("You must provide study resources or a syllabus.");
      return;
    }
    onStartLock(resources, duration);
  };

  return (
    <div className="max-w-xl mx-auto w-full p-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Nuclear Protocol</h1>
        <p className="text-gray-500">Configure your session. Once started, you cannot leave until the AI verifies your handwritten homework.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Study Material / Syllabus
          </label>
          <textarea
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            className="w-full h-48 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none font-mono text-sm"
            placeholder="Paste your assignment requirements, syllabus, or reading material here. The AI will use this to grade your handwritten submission."
            required
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            Lock Duration (Minutes)
          </label>
          <input
            type="number"
            min="1"
            max="180"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            In the real app, your phone would be bricked for this duration unless you pass the AI evaluation.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Initiate Lock Protocol
        </button>
      </form>
    </div>
  );
}
