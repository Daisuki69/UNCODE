import { ScheduleData } from './types';

export function getActiveLockWindow(currentTimeMs: number, schedule: ScheduleData): { isLocked: boolean; endTimeMs: number; timeUntilLockSeconds: number } {
  const now = new Date(currentTimeMs);
  const [actHours, actMinutes] = schedule.activationTime.split(':').map(Number);
  
  // Create a candidate scheduled time for today
  let scheduledTime = new Date(now);
  scheduledTime.setHours(actHours, actMinutes, 0, 0);
  
  // Since the allowed hours are 7 PM (19:00) to 3 AM (03:00)
  // A "schedule day" practically spans from noon to noon.
  // If current hour is < 12 (e.g. 1 AM), it belongs to the "previous" schedule day.
  // We want to normalize the scheduledTime so it's the one most relevant to right now.
  
  const currentHours = now.getHours();
  
  if (actHours < 12) {
    // Scheduled for early morning (e.g., 1 AM, 2 AM, 3 AM)
    if (currentHours >= 12) {
      // It's evening, the next occurrence of this schedule is tomorrow morning
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
  } else {
    // Scheduled for evening (e.g., 7 PM, 8 PM)
    if (currentHours < 12) {
      // It's morning, the previous occurrence of this schedule was yesterday evening
      scheduledTime.setDate(scheduledTime.getDate() - 1);
    }
  }

  const startTimeMs = scheduledTime.getTime();
  const durationMs = schedule.durationMinutes * 60000;
  const endTimeMs = startTimeMs + durationMs;
  const nowMs = now.getTime();

  const isLocked = nowMs >= startTimeMs && nowMs < endTimeMs;
  
  // If we're past the end time of the *current* occurrence, we need to look at the next one.
  // But actually, we only need to push it forward if nowMs >= endTimeMs.
  if (nowMs >= endTimeMs) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
    return {
      isLocked: false,
      endTimeMs: scheduledTime.getTime() + durationMs,
      timeUntilLockSeconds: Math.floor((scheduledTime.getTime() - nowMs) / 1000)
    };
  }

  return {
    isLocked,
    endTimeMs,
    timeUntilLockSeconds: isLocked ? 0 : Math.max(0, Math.floor((startTimeMs - nowMs) / 1000))
  };
}
