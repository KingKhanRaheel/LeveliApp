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
  lastActiveDate: string;
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
  sessions: [],
  pomodorosCompleted: 0
};

export function useGameState() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem("focusgate_progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      
      const today = new Date().toDateString();
      if (parsed.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const streakDays = parsed.lastActiveDate === yesterday 
          ? parsed.streakDays 
          : 0;
        
        return { ...parsed, streakDays };
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
        const today = new Date().toDateString();
        
        if (parsed.lastActiveDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const streakDays = parsed.lastActiveDate === yesterday 
            ? parsed.streakDays 
            : 0;
          setProgress({ ...parsed, streakDays });
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

    const session: Session = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      minutes,
      type
    };

    const today = new Date().toDateString();
    const isNewDay = progress.lastActiveDate !== today;
    const newStreakDays = isNewDay ? progress.streakDays + 1 : progress.streakDays;

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

    return { xpGained, leveledUp, newLevel };
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
