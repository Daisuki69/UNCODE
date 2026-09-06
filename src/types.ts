export type AppState = 'onboarding' | 'dashboard' | 'create_schedule' | 'locked' | 'evaluating' | 'result' | 'settings' | 'edit_rubric';

export interface SavedResource {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

export interface ScheduleData {
  id: string;
  title?: string;
  homeworkContent: string;
  rubricMode: 'ai' | 'manual';
  rubricContent: string;
  selectedResourceIds?: string[];
  activationTime: string; // HH:mm
  durationMinutes: number;
  isActive: boolean;
}

export interface AppSettings {
  onboardingComplete: boolean;
  role: 'student' | 'teacher' | 'just a guy';
  schedules: ScheduleData[];
  apiKey?: string;
  apiModel?: string;
  prompts?: Record<string, string>;
  simpleOcrKey?: string;
  formattedOcrKey?: string;
  defaultOcrType?: 'simple' | 'formatted';
  uiScale?: number;
  uiWidth?: string;
}

export interface EvaluationResult {
  wordCount?: number;
  sentenceCount?: number;
  passed: boolean;
  feedback: string;
  transcribedText: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  action: string;
  details?: string;
}

export interface CompletedHomework {
  id: string;
  title: string;
  homeworkContent: string;
  rubricContent: string;
  transcribedText: string;
  feedback: string;
  passed: boolean;
  timestamp: number;
}
