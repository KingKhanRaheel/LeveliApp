import { useState, useEffect } from "react";
import { ACHIEVEMENTS, calculateLevel, getXPForNextLevel, getCurrentLevelXP } from "@/lib/achievements";

interface Session {
  id: string;
  timestamp: number;
  minutes: number;
  type: "focus" | "pomodoro";
}

interface UserProgress {
  totalMinutes: number;
  xp: number;
  level: number;
  streakDays: number;
  achievements: string[];
  lastActiveDate: string; // Keep for backward compatibility
  lastSessionTimestamp: number; // New: actual timestamp for 24-hour tracking
  lastStreakIncrementTimestamp: number; // New: when we last incremented the streak
  sessions: Session[];
  pomodorosCompleted: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  totalMinutes: 0,
  xp: 0,
  level: 1,
  streakDays: 0,
  achievements: [],
  lastActiveDate: new Date().toDateString(),
  lastSessionTimestamp: 0,
  lastStreakIncrementTimestamp: 0,
  sessions: [],
  pomodorosCompleted: 0
};

export function useGameState() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("focusgate_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Migrate old data to new format
      if (!parsed.lastSessionTimestamp) {
        parsed.lastSessionTimestamp = parsed.sessions?.length > 0 
          ? parsed.sessions[parsed.sessions.length - 1].timestamp 
          : 0;
      }
      if (!parsed.lastStreakIncrementTimestamp) {
        parsed.lastStreakIncrementTimestamp = parsed.lastSessionTimestamp;
      }
      
      // Check if streak should be reset (no activity in last 24 hours)
      const now = Date.now();
      const timeSinceLastSession = now - parsed.lastSessionTimestamp;
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      
      if (parsed.lastSessionTimestamp > 0 && timeSinceLastSession > TWENTY_FOUR_HOURS) {
        // Reset streak if more than 24 hours since last session
        const resetData = { ...parsed, streakDays: 0, lastStreakIncrementTimestamp: 0 };
        // Persist the reset immediately
        localStorage.setItem("focusgate_progress", JSON.stringify(resetData));
        return resetData;
      }
      
      return parsed;
    }
    return DEFAULT_PROGRESS;
  });
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleProgressUpdate = () => {
      const saved = localStorage.getItem("focusgate_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Migrate old data
        if (!parsed.lastSessionTimestamp) {
          parsed.lastSessionTimestamp = parsed.sessions?.length > 0 
            ? parsed.sessions[parsed.sessions.length - 1].timestamp 
            : 0;
        }
        if (!parsed.lastStreakIncrementTimestamp) {
          parsed.lastStreakIncrementTimestamp = parsed.lastSessionTimestamp;
        }
        
        // Check if streak should be reset
        const now = Date.now();
        const timeSinceLastSession = now - parsed.lastSessionTimestamp;
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
        
        if (parsed.lastSessionTimestamp > 0 && timeSinceLastSession > TWENTY_FOUR_HOURS) {
          const resetData = { ...parsed, streakDays: 0, lastStreakIncrementTimestamp: 0 };
          localStorage.setItem("focusgate_progress", JSON.stringify(resetData));
          setProgress(resetData);
        } else {
          setProgress(parsed);
        }
      }
    };

    window.addEventListener("progressUpdated", handleProgressUpdate);
    document.addEventListener("visibilitychange", handleProgressUpdate);

    return () => {
      window.removeEventListener("progressUpdated", handleProgressUpdate);
      document.removeEventListener("visibilitychange", handleProgressUpdate);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("focusgate_progress", JSON.stringify(progress));
  }, [progress]);

  const completeSession = (minutes: number, type: "focus" | "pomodoro", pomodoroBonus: boolean = false) => {
    const xpGained = minutes + (pomodoroBonus ? 10 : 0);
    const newXP = progress.xp + xpGained;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > progress.level;

    const now = Date.now();
    const session: Session = {
      id: now.toString(),
      timestamp: now,
      minutes,
      type
    };

    // 24-hour streak logic
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const timeSinceLastSession = now - progress.lastSessionTimestamp;
    const timeSinceLastStreak = now - progress.lastStreakIncrementTimestamp;
    
    let newStreakDays = progress.streakDays;
    let newStreakIncrementTimestamp = progress.lastStreakIncrementTimestamp;
    
    // First session ever or streak was reset
    if (progress.streakDays === 0) {
      newStreakDays = 1;
      newStreakIncrementTimestamp = now;
    }
    // Been more than 24 hours since last session - reset streak
    else if (timeSinceLastSession > TWENTY_FOUR_HOURS) {
      newStreakDays = 1;
      newStreakIncrementTimestamp = now;
    }
    // Been more than 24 hours since last streak increment - increment streak
    else if (timeSinceLastStreak >= TWENTY_FOUR_HOURS) {
      newStreakDays = progress.streakDays + 1;
      newStreakIncrementTimestamp = now;
    }
    // Otherwise maintain current streak (session within same 24-hour period)

    const today = new Date().toDateString();
    const dailyMinutes = progress.sessions
      .filter(s => new Date(s.timestamp).toDateString() === today)
      .reduce((sum, s) => sum + s.minutes, 0) + minutes;

    const newProgress = {
      ...progress,
      totalMinutes: progress.totalMinutes + minutes,
      xp: newXP,
      level: newLevel,
      streakDays: newStreakDays,
      lastActiveDate: today,
      lastSessionTimestamp: now,
      lastStreakIncrementTimestamp: newStreakIncrementTimestamp,
      sessions: [...progress.sessions, session],
      pomodorosCompleted: progress.pomodorosCompleted + (pomodoroBonus ? 1 : 0)
    };

    const stats = {
      totalMinutes: newProgress.totalMinutes,
      totalSessions: newProgress.sessions.length,
      streakDays: newProgress.streakDays,
      pomodorosCompleted: newProgress.pomodorosCompleted,
      dailyMinutes
    };

    const newAchievements = ACHIEVEMENTS
      .filter(a => !newProgress.achievements.includes(a.id) && a.condition(stats))
      .map(a => a.id);

    const finalProgress = {
      ...newProgress,
      achievements: [...newProgress.achievements, ...newAchievements]
    };
    
    setProgress(finalProgress);
    
    // Save immediately and notify other instances
    localStorage.setItem("focusgate_progress", JSON.stringify(finalProgress));
    window.dispatchEvent(new Event("progressUpdated"));

    // Store newly unlocked achievements for later display
    if (newAchievements.length > 0) {
      const pending = JSON.parse(sessionStorage.getItem("pending_achievements") || "[]");
      sessionStorage.setItem("pending_achievements", JSON.stringify([...pending, ...newAchievements]));
    }

    return { xpGained, leveledUp, newLevel, newAchievements };
  };

  const getStats = () => {
    const today = new Date().toDateString();
    const dailyMinutes = progress.sessions
      .filter(s => new Date(s.timestamp).toDateString() === today)
      .reduce((sum, s) => sum + s.minutes, 0);

    const weekAgo = Date.now() - 7 * 86400000;
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 86400000).toDateString();
      const minutes = progress.sessions
        .filter(s => new Date(s.timestamp).toDateString() === date)
        .reduce((sum, s) => sum + s.minutes, 0);
      return { date: date.slice(0, 3), minutes };
    });

    return {
      dailyMinutes,
      weeklyData,
      totalMinutes: progress.totalMinutes,
      streakDays: progress.streakDays,
      level: progress.level,
      xp: progress.xp,
      currentLevelXP: getCurrentLevelXP(progress.xp),
      xpForNextLevel: getXPForNextLevel(progress.level),
      achievements: progress.achievements,
      totalSessions: progress.sessions.length
    };
  };

  return {
    progress,
    completeSession,
    getStats
  };
}
