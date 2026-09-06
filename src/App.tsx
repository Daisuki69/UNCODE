import React, { useState, useEffect, useCallback } from 'react';
import { AppState, AppSettings, EvaluationResult as IEvaluationResult, ScheduleData, SavedResource, LogEntry } from './types';
import { Dashboard } from './components/Dashboard';
import { LockScreen } from './components/LockScreen';
import { EvaluationResult } from './components/EvaluationResult';
import { Onboarding } from './components/Onboarding';
import { CreateSchedule } from './components/CreateSchedule';
import { SettingsOverlay } from './components/SettingsOverlay';
import { EditRubric } from './components/EditRubric';
import { HomeworksPage } from './components/HomeworksPage';
import { Loader2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const modalVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const ModalTransition = ({ children, keyStr }: { children: React.ReactNode, keyStr: string }) => (
  <motion.div
    key={keyStr}
    variants={modalVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.2 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm"
  >
    {children}
  </motion.div>
);
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

const PageTransition = ({ children, keyStr, direction = 'forward' }: { children: React.ReactNode, keyStr: string, direction?: 'forward' | 'backward' }) => (
  <motion.div
    key={keyStr}
    custom={direction}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full"
  >
    {children}
  </motion.div>
);

export default function App() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isResourceEditing, setIsResourceEditing] = useState(false);
  useEffect(() => {
    if (globalError) {
      const t = setTimeout(() => setGlobalError(null), 10000);
      return () => clearTimeout(t);
    }
  }, [globalError]);

  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const navigate = useCallback((newState: AppState, direction: 'forward' | 'backward' = 'forward') => {
    setNavDirection(direction);
    setAppState(newState);
  }, []);

  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('studom_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.onboardingComplete) return 'dashboard';
    }
    return 'onboarding';
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('studom_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old schedule to schedules array
      if (parsed.schedule && !parsed.schedules) {
        parsed.schedules = [{ ...parsed.schedule, id: crypto.randomUUID() }];
        delete parsed.schedule;
      } else if (!parsed.schedules) {
        parsed.schedules = [];
      }
      return parsed;
    }
    return { 
      onboardingComplete: false,
      role: 'just a guy',
      schedules: []
    };
  });

  const [evaluationResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timeOffset, setTimeOffset] = useState<number>(() => {
    const saved = localStorage.getItem('studom_timeOffset');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('studom_timeOffset', timeOffset.toString());
  }, [timeOffset]);

  const [timeUntilLock, setTimeUntilLock] = useState<number | null>(null);
  const [nextActivationDate, setNextActivationDate] = useState<Date | null>(null);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);
  const [lockPauseTime, setLockPauseTime] = useState<number | null>(null);
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);
  const [editingRubricScheduleId, setEditingRubricScheduleId] = useState<string | null>(null);

  const resumeLock = () => {
    if (lockPauseTime && lockEndTime) {
      setLockEndTime(lockEndTime + (Date.now() - lockPauseTime));
      setLockPauseTime(null);
    }
    navigate('locked');
  };

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('studom_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('studom_logs', JSON.stringify(logs));
  }, [logs]);
  const [completedHomeworks, setCompletedHomeworks] = useState<import('./types').CompletedHomework[]>(() => {
    const saved = localStorage.getItem('studom_completed_homeworks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('studom_completed_homeworks', JSON.stringify(completedHomeworks));
  }, [completedHomeworks]);


  const addLog = (action: string, details?: string) => {
    setLogs(prev => [{
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      action,
      details
    }, ...prev].slice(0, 500));
  };

  const [resources, setResources] = useState<SavedResource[]>(() => {
    const saved = localStorage.getItem('studom_resources');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('studom_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('studom_resources', JSON.stringify(resources));
  }, [resources]);

  const getCurrentTime = useCallback(() => Date.now() + timeOffset, [timeOffset]);

  useEffect(() => {
    const activeSchedules = settings.schedules?.filter(s => s.isActive) || [];
    
    if (activeSchedules.length === 0 || appState !== 'dashboard') {
      setTimeUntilLock(null);
      setNextActivationDate(null);
      return;
    }

    const checkSchedule = () => {
      const now = new Date(getCurrentTime());
      const currentHours = now.getHours();

      let nearestUpcomingTime: number | null = null;
      let nearestScheduleDate: Date | null = null;
      let foundActive = false;

      for (const schedule of activeSchedules) {
        const [actHours, actMinutes] = schedule.activationTime.split(':').map(Number);
        
        const scheduledTime = new Date(now);
        scheduledTime.setHours(actHours, actMinutes, 0, 0);
        
        const yesterdayScheduledTime = new Date(scheduledTime);
        yesterdayScheduledTime.setDate(yesterdayScheduledTime.getDate() - 1);

        const durationMs = schedule.durationMinutes * 60000;
        
        let inWindow = false;
        let lockEnd = 0;

        // Check if currently in today's lock window
        if (now.getTime() >= scheduledTime.getTime() && now.getTime() < scheduledTime.getTime() + durationMs) {
          inWindow = true;
          lockEnd = scheduledTime.getTime() + durationMs;
        } 
        // Check if currently in yesterday's lock window (e.g. crossed midnight)
        else if (now.getTime() >= yesterdayScheduledTime.getTime() && now.getTime() < yesterdayScheduledTime.getTime() + durationMs) {
          inWindow = true;
          lockEnd = yesterdayScheduledTime.getTime() + durationMs;
        }

        if (inWindow) {
          setLockEndTime(lockEnd);
          setActiveScheduleId(schedule.id);
          navigate('locked');
          foundActive = true;
          return; // Exit out of checkSchedule completely
        }

        // Calculate next future activation date for this schedule
        if (now.getTime() >= scheduledTime.getTime()) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        const timeUntilMs = scheduledTime.getTime() - now.getTime();
        if (nearestUpcomingTime === null || timeUntilMs < nearestUpcomingTime) {
          nearestUpcomingTime = timeUntilMs;
          nearestScheduleDate = scheduledTime;
        }
      }

      if (!foundActive && nearestUpcomingTime !== null && nearestScheduleDate !== null) {
        setNextActivationDate(nearestScheduleDate);
        const diffSeconds = Math.max(0, Math.floor(nearestUpcomingTime / 1000));
        setTimeUntilLock(diffSeconds);

        if (diffSeconds === 0) {
          // It will lock on the next tick naturally
        }
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [settings.schedules, appState, timeOffset]);

  const notifyUser = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification('UNCODE ALARM', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('UNCODE ALARM', { body: message });
        }
      });
    }
  };

  const handleTimeOverride = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
    const now = new Date();
    const simDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds || 0);
    const newOffset = simDate.getTime() - Date.now();
    setTimeOffset(newOffset);
  };

  const handleTimeout = useCallback((skipped?: boolean) => {
    notifyUser(skipped ? 'Lock skipped (Test mode)' : 'Lock duration expired. Device access restored.');
    if (skipped && activeScheduleId) {
      setSettings(prev => ({
        ...prev,
        schedules: (prev.schedules || []).filter(s => s.id !== activeScheduleId)
      }));
    }
    navigate('dashboard', 'backward');
  }, [activeScheduleId]);

  const handleCompleteOnboarding = (role: 'student' | 'teacher' | 'just a guy') => {
    setSettings(prev => ({ ...prev, onboardingComplete: true, role }));
    navigate('dashboard', 'forward');
  };

  const handleSaveSchedule = (schedule: ScheduleData) => {
    setSettings(prev => {
      const schedules = prev.schedules || [];
      const isExisting = schedules.some(s => s.id === schedule.id);
      return {
        ...prev,
        schedules: isExisting 
          ? schedules.map(s => s.id === schedule.id ? schedule : s)
          : [...schedules, schedule]
      };
    });
    navigate('dashboard', 'backward');
  };

  const handleAddResource = (title: string, content: string) => {
    setResources([...resources, { id: crypto.randomUUID(), title, content, createdAt: Date.now() }]);
  };

  const handleUpdateResource = (id: string, title: string, content: string) => {
    setResources(resources.map(r => r.id === id ? { ...r, title, content } : r));
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleCombineResources = (id1: string, id2: string) => {
    setResources(prev => {
      const r1 = prev.find(r => r.id === id1);
      const r2 = prev.find(r => r.id === id2);
      if (!r1 || !r2) return prev;
      
      const combinedContent = `${r1.content}\n\n---\n\n${r2.content}`;
      const combinedTitle = `${r1.title} & ${r2.title}`;
      
      const newResource: SavedResource = {
        id: crypto.randomUUID(),
        title: combinedTitle.length > 50 ? combinedTitle.substring(0, 47) + '...' : combinedTitle,
        content: combinedContent,
        createdAt: Date.now()
      };
      
      return [...prev.filter(r => r.id !== id1 && r.id !== id2), newResource];
    });
  };

  const handleSubmitHomework = async (file: File, scheduleId: string, ocrType: 'simple' | 'formatted', transcribedText?: string) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("This image is too large (over 5MB). Please compress it or take a lower resolution photo before uploading.");
      return;
    }
    setLockPauseTime(Date.now());
    navigate('evaluating');
    setIsEvaluating(true);

    const activeSchedule = settings.schedules?.find(s => s.id === scheduleId);

    try {
      const formData = new FormData();
      formData.append('homeworkImage', file);
      formData.append('resources', activeSchedule?.rubricContent || '');
      formData.append('role', settings.role);
      if (transcribedText) formData.append('transcribedText', transcribedText);

      const headers: Record<string, string> = {};
      if (settings.apiModel) {
        headers['x-api-model'] = settings.apiModel;
      }
      if (settings.apiKey) {
        headers['x-api-key'] = settings.apiKey;
      }
      if (settings.simpleOcrKey) headers['x-simple-ocr-key'] = settings.simpleOcrKey;
      if (settings.formattedOcrKey) headers['x-formatted-ocr-key'] = settings.formattedOcrKey;
      headers['x-ocr-type'] = ocrType;

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const rawText = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = JSON.parse(rawText) as Record<string, unknown>;
      } catch (error) {
        console.error('Failed to parse response as JSON. Raw text:', rawText.substring(0, 200), error);
        if (!res.ok) {
          throw new Error(`Server error (${res.status}): The server returned an invalid response. Please try again.`);
        }
        throw new Error('Unexpected response format from server. Please try again.');
      }

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('The image file is too large. Please compress it or take a lower resolution photo.');
        }
        const errorMessage = typeof data.error === 'string' ? data.error : '';
        if (res.status === 401 || errorMessage.includes('UNAUTHENTICATED')) {
          throw new Error('Invalid API Key. Please update your API key in the Settings overlay.');
        }
        throw new Error(errorMessage || 'Evaluation failed');
      }

      const evaluation = data as Partial<IEvaluationResult>;
      if (typeof evaluation.passed !== 'boolean' || typeof evaluation.feedback !== 'string' || typeof evaluation.transcribedText !== 'string') {
        throw new Error('The server returned an invalid evaluation payload.');
      }

      const typedEvaluation: IEvaluationResult = {
        passed: evaluation.passed,
        feedback: evaluation.feedback,
        transcribedText: evaluation.transcribedText,
        wordCount: typeof evaluation.wordCount === 'number' ? evaluation.wordCount : undefined,
        sentenceCount: typeof evaluation.sentenceCount === 'number' ? evaluation.sentenceCount : undefined,
      };

      setEvaluationResult(typedEvaluation);
      setCompletedHomeworks(prev => [{
        id: crypto.randomUUID(),
        title: activeSchedule?.title || 'Untitled Schedule',
        homeworkContent: activeSchedule?.homeworkContent || '',
        rubricContent: activeSchedule?.rubricContent || '',
        transcribedText: typedEvaluation.transcribedText,
        feedback: typedEvaluation.feedback,
        passed: typedEvaluation.passed,
        timestamp: Date.now()
      }, ...prev]);

      navigate('result');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setGlobalError(`Evaluation Error: ${message}`);
      resumeLock();
    } finally {
      setIsEvaluating(false);
    }
  };

  const displayTime = new Date(getCurrentTime());
  
  const formatForInput = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const zoomStyle: React.CSSProperties = settings.uiScale && settings.uiScale !== 100 ? { zoom: `${settings.uiScale}%` } : {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-200 overflow-hidden" style={zoomStyle}>
      {globalError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4">
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1 whitespace-pre-wrap text-sm font-medium">
              {globalError}
            </div>
            <button onClick={() => setGlobalError(null)} className="p-1 hover:bg-red-700 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {appState === 'onboarding' && (
          <motion.div key="onboarding" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">
            <Onboarding onComplete={handleCompleteOnboarding} />
          </motion.div>
        )}
      </AnimatePresence>

      

      <div className="relative flex-1 w-full h-full overflow-hidden">
        <AnimatePresence custom={navDirection}>
          {['dashboard', 'settings', 'logs'].includes(appState) && (
          <motion.div key="dashboard" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">
            <Dashboard showError={setGlobalError}
              displayTime={displayTime}
              timeOffset={timeOffset}
              onTimeOverride={handleTimeOverride}
              onResetTime={() => setTimeOffset(0)}
              onResourceEditStateChange={setIsResourceEditing} 
              settings={settings}
              timeUntilLock={timeUntilLock}
              nextActivationDate={nextActivationDate}
              onCreateSchedule={() => navigate('create_schedule')}
              onClearSchedule={(id) => {
                if (id) {
                  setSettings(prev => ({ ...prev, schedules: prev.schedules.filter(s => s.id !== id) }));
                  addLog('Deleted Schedule');
                } else {
                  setSettings(prev => ({ ...prev, schedules: [] }));
                  addLog('Cleared All Schedules');
                }
              }}
              onOpenSettings={() => navigate('settings')}
              onOpenLogs={() => navigate('logs')}
              resources={resources}
              onAddResource={handleAddResource}
              onUpdateResource={handleUpdateResource}
              onRemoveResource={handleRemoveResource}
              onCombineResources={handleCombineResources}
              onViewRubric={(schedule) => {
                setEditingRubricScheduleId(schedule.id);
                navigate('edit_rubric');
              }}
            />
          </motion.div>
        )}

        {appState === 'create_schedule' && (
          <motion.div key="create_schedule" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">
            <CreateSchedule showError={setGlobalError} 
              role={settings.role}
              resources={resources}
              apiKey={settings.apiKey}
              apiModel={settings.apiModel}
              existingSchedules={settings.schedules || []}
              settings={settings}
              addLog={addLog}
              onSave={handleSaveSchedule}
              onCancel={() => navigate('dashboard', 'backward')}
            />
          </motion.div>
        )}

        {appState === 'edit_rubric' && editingRubricScheduleId && (
          <motion.div key="edit_rubric" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">
            <EditRubric
              schedule={settings.schedules.find(s => s.id === editingRubricScheduleId)!}
              resources={resources}
              apiKey={settings.apiKey}
              apiModel={settings.apiModel}
              role={settings.role}
              onSave={(updatedSchedule) => {
                setSettings(prev => ({
                  ...prev,
                  schedules: prev.schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s)
                }));
                navigate('dashboard', 'backward');
              }}
              onCancel={() => navigate('dashboard', 'backward')}
              showError={setGlobalError}
            />
          </motion.div>
        )}

        {appState === 'locked' && activeScheduleId && lockEndTime && (
          <motion.div key="locked" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">
            <LockScreen 
              schedule={settings.schedules.find(s => s.id === activeScheduleId)!}
              settings={settings}
              resources={resources}
              lockEndTime={lockEndTime}
              onSubmitHomework={(file, ocrType, text) => handleSubmitHomework(file, activeScheduleId, ocrType, text)}
              onTimeout={handleTimeout}
              getCurrentTime={getCurrentTime}
              onTimeOverride={handleTimeOverride}
              timeOffset={timeOffset}
              onResetTime={() => setTimeOffset(0)}
            />
          </motion.div>
        )}

        {appState === 'result' && evaluationResult && (
          <motion.div key="result" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto bg-gray-50 flex flex-col w-full h-full">
            <EvaluationResult 
              result={evaluationResult}
              onReset={() => {
                if (activeScheduleId) {
                  setSettings(prev => ({
                    ...prev,
                    schedules: prev.schedules.map(s => s.id === activeScheduleId ? { ...s, isActive: false } : s)
                  }));
                }
                navigate('dashboard', 'backward');
              }}
              onRetry={resumeLock}
            />
          </motion.div>
        )}

        

        
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {appState === 'logs' && (
          <ModalTransition keyStr="logs">
            <HomeworksPage 
              homeworks={completedHomeworks}
              onBack={() => navigate('dashboard', 'backward')}
              onClear={() => setCompletedHomeworks([])}
            />
          </ModalTransition>
        )}
        {appState === 'settings' && (
          <ModalTransition keyStr="settings">
            <SettingsOverlay
              settings={settings}
              logs={logs}
              onClearLogs={() => setLogs([])}
              onSave={(updates) => {
                setSettings(prev => ({ ...prev, ...updates }));
                navigate('dashboard', 'backward');
              }}
              onClose={() => navigate('dashboard', 'backward')}
            />
          </ModalTransition>
        )}
      </AnimatePresence>

      <AnimatePresence>{appState === 'evaluating' && (
        <ModalTransition keyStr="evaluating">
          <div className="flex flex-col items-center justify-center text-white">
            <Loader2 className="w-16 h-16 text-red-500 animate-spin mb-6" />
            <h2 className="text-2xl font-black tracking-widest text-gray-900 mb-2 uppercase">AI is grading your work</h2>
            <p className="text-gray-500 text-center font-mono">Comparing handwritten submission against rubric...</p>
          </div>
        </ModalTransition>
      )}
      </AnimatePresence>
    </div>
  );
}
