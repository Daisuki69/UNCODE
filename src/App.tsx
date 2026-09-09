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
import { startLockdown, endLockdown } from './systemBridge';
import { evaluate } from './api/evaluate';
import { declutterResource } from './api/declutterResource';
import { PermissionWalkthrough } from './components/PermissionWalkthrough';
import { checkPermissions } from './systemBridge';
import { loadData, saveData } from './storage';

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
  initial: (direction: 'forward' | 'backward') => {
    console.log("initial direction:", direction);
    return {
      opacity: 0,
      x: direction === 'forward' ? '100%' : '-100%'
    };
  },
  animate: { opacity: 1, x: 0 },
  exit: (direction: 'forward' | 'backward') => {
    console.log("exit direction:", direction);
    return {
      opacity: 0,
      x: direction === 'forward' ? '-100%' : '100%'
    };
  }
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

  const [isLoaded, setIsLoaded] = useState(false);
  const [appState, setAppState] = useState<AppState>('onboarding');
  
  const [settings, setSettings] = useState<AppSettings>({ 
    onboardingComplete: false,
    role: 'just a guy',
    schedules: []
  });

  const [evaluationResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timeOffset, setTimeOffset] = useState<number>(0);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) saveData('studom_timeOffset', timeOffset);
  }, [timeOffset, isLoaded]);

  const [timeUntilLock, setTimeUntilLock] = useState<number | null>(null);
  const [nextActivationDate, setNextActivationDate] = useState<Date | null>(null);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);
  const [lockPauseTime, setLockPauseTime] = useState<number | null>(null);
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);
  const [editingRubricScheduleId, setEditingRubricScheduleId] = useState<string | null>(null);

  // Global Permission Checking (on mount and on resume)
  useEffect(() => {
    if (appState === 'onboarding' || appState === 'permission_walkthrough') return;
    
    const verify = async () => {
      const perms = await checkPermissions();
      if (!perms.isDeviceOwner && !perms.isAccessibilityEnabled) {
        navigate('permission_walkthrough');
      }
    };
    
    verify();
  }, [appState, navigate]);

  const resumeLock = () => {
    if (lockPauseTime && lockEndTime) {
      setLockEndTime(lockEndTime + (Date.now() - lockPauseTime));
      setLockPauseTime(null);
    }
    navigate('locked');
  };

  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (isLoaded) saveData('studom_logs', logs);
  }, [logs, isLoaded]);

  const [completedHomeworks, setCompletedHomeworks] = useState<import('./types').CompletedHomework[]>([]);

  useEffect(() => {
    if (isLoaded) saveData('studom_completed_homeworks', completedHomeworks);
  }, [completedHomeworks, isLoaded]);


  const addLog = (action: string, details?: string) => {
    setLogs(prev => [{
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      action,
      details
    }, ...prev].slice(0, 500));
  };

  const [resources, setResources] = useState<SavedResource[]>([]);

  useEffect(() => {
    if (isLoaded) saveData('studom_settings', settings);
  }, [settings, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveData('studom_resources', resources);
  }, [resources, isLoaded]);

  // Load all data on mount
  useEffect(() => {
    async function loadAll() {
      const loadedSettings = await loadData<AppSettings>('studom_settings', { onboardingComplete: false, role: 'just a guy', schedules: [] });
      
      // Migrate old schedule
      if ((loadedSettings as any).schedule && !loadedSettings.schedules) {
        loadedSettings.schedules = [{ ...(loadedSettings as any).schedule, id: crypto.randomUUID() }];
        delete (loadedSettings as any).schedule;
      } else if (!loadedSettings.schedules) {
        loadedSettings.schedules = [];
      }

      setSettings(loadedSettings);
      setAppState(loadedSettings.onboardingComplete ? 'dashboard' : 'onboarding');
      setResources(await loadData<SavedResource[]>('studom_resources', []));
      setLogs(await loadData<LogEntry[]>('studom_logs', []));
      setCompletedHomeworks(await loadData<import('./types').CompletedHomework[]>('studom_completed_homeworks', []));
      setTimeOffset(await loadData<number>('studom_timeOffset', 0));
      setIsLoaded(true);
    }
    loadAll();
  }, []);

  const getCurrentTime = useCallback(() => Date.now() + timeOffset, [timeOffset]);

  useEffect(() => {
    const activeSchedules = settings.schedules?.filter(s => s.isActive) || [];
    
    if (activeSchedules.length === 0) {
      if (appState === 'locked') {
        endLockdown();
        navigate('dashboard');
      }
      setTimeUntilLock(null);
      setNextActivationDate(null);
      return;
    }

    if (appState === 'create_schedule' || appState === 'edit_rubric') {
      return; // Pause lock checking while editing schedules
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
          if (appState !== 'locked' && appState !== 'evaluating' && appState !== 'result') {
            startLockdown(settings.allowedApps?.map(a => a.id) || []);
            navigate('locked');
          }
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

      if (!foundActive) {
        if (appState === 'locked') {
          endLockdown();
          navigate('dashboard');
        }

        if (nearestUpcomingTime !== null && nearestScheduleDate !== null) {
          setNextActivationDate(nearestScheduleDate);
          const diffSeconds = Math.max(0, Math.floor(nearestUpcomingTime / 1000));
          setTimeUntilLock(diffSeconds);
        } else {
          setTimeUntilLock(null);
          setNextActivationDate(null);
        }
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [settings.schedules, appState, timeOffset]);

  const notifyUser = (message: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('QIEZKA ALARM', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('QIEZKA ALARM', { body: message });
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
    endLockdown(); // Always release native lock if timer runs out or is skipped
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
    if (!transcribedText) {
      setGlobalError('Evaluation Error: No transcribed text found. Please run OCR first.');
      return;
    }
    setLockPauseTime(Date.now());
    navigate('evaluating');
    setIsEvaluating(true);

    const activeSchedule = settings.schedules?.find(s => s.id === scheduleId);

    try {
      const data = await evaluate({
        transcribedText,
        rubric: activeSchedule?.rubricContent || '',
        apiKey: settings.apiKey || '',
        apiModel: settings.apiModel || 'gemini-2.0-flash',
        customPrompts: settings.prompts,
      });

      setEvaluationResult(data);
      setCompletedHomeworks(prev => [{
        id: crypto.randomUUID(),
        title: activeSchedule?.title || 'Untitled Schedule',
        homeworkContent: activeSchedule?.homeworkContent || '',
        rubricContent: activeSchedule?.rubricContent || '',
        transcribedText: data.transcribedText || '',
        feedback: data.feedback || '',
        passed: data.passed || false,
        timestamp: Date.now()
      }, ...prev]);

      if (data.passed) {
        // Auto-Harvesting Logic
        if (activeSchedule?.selectedResourceIds?.includes('ai-general-knowledge')) {
          const textToHarvest = activeSchedule.aiAnswer || transcribedText || data.transcribedText;
          if (textToHarvest) {
            // Background call to declutter and save
            declutterResource({
              title: 'AI Research: ' + (activeSchedule.title || 'Topic'),
              content: textToHarvest,
              apiKey: settings.apiKey || '',
              apiModel: settings.apiModel || 'gemini-2.0-flash',
              customPrompts: settings.prompts,
            }).then(harvestData => {
              const realResources = activeSchedule.selectedResourceIds!.filter(id => id !== 'ai-general-knowledge');
              if (realResources.length > 0) {
                setResources(prev => prev.map(r => r.id === realResources[0] ? { ...r, content: r.content + '\n\n' + harvestData.content } : r));
              } else {
                setResources(prev => [...prev, { id: crypto.randomUUID(), title: harvestData.title || 'AI Research', content: harvestData.content, createdAt: Date.now() }]);
              }
            }).catch(console.error);
          }
        }

        // Only clean up the lockscreen data if the student passed
        localStorage.removeItem(`lockscreen_data_${scheduleId}`);
        endLockdown(); // Release the OS lock!
        navigate('result');
      } else {
        navigate('result');
      }
    } catch (error: any) {
      setGlobalError(`Evaluation Error: ${error.message || 'Unknown error'}`);
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

  const zoomStyle = settings.uiScale && settings.uiScale !== 100 ? { zoom: `${settings.uiScale}%` } as any : {};

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-red-500 font-black">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <span className="uppercase tracking-widest text-xs font-bold text-gray-500">Decrypting QIEZKA...</span>
      </div>
    );
  }

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
              onSettingsChange={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
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
              onSettingsChange={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
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

        

        {appState === 'permission_walkthrough' && (
          <motion.div key="permission_walkthrough" custom={navDirection} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3, ease: 'easeOut' }} className="absolute inset-0 overflow-y-auto flex flex-col w-full h-full z-50">
            <PermissionWalkthrough onComplete={() => navigate('dashboard')} />
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
