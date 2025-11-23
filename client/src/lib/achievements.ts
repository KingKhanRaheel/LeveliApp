import { LucideIcon, Zap, Clock, Flame, Target, Trophy, Star, Award, Crown, Rocket } from "lucide-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  condition: (stats: GameStats) => boolean;
}

export interface GameStats {
  totalMinutes: number;
  totalSessions: number;
  streakDays: number;
  pomodorosCompleted: number;
  dailyMinutes: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_session",
    name: "First Session",
    description: "completed your first focus session",
    icon: Zap,
    condition: (stats) => stats.totalSessions >= 1
  },
  {
    id: "100_minutes",
    name: "100 Minutes",
    description: "focused for 100 total minutes",
    icon: Clock,
    condition: (stats) => stats.totalMinutes >= 100
  },
  {
    id: "3_hours_day",
    name: "Big Brain Day",
    description: "focused for 3 hours in one day",
    icon: Target,
    condition: (stats) => stats.dailyMinutes >= 180
  },
  {
    id: "7_day_streak",
    name: "Week Warrior",
    description: "maintained a 7-day streak",
    icon: Flame,
    condition: (stats) => stats.streakDays >= 7
  },
  {
    id: "25_pomodoros",
    name: "Pomodoro Pro",
    description: "completed 25 pomodoro cycles",
    icon: Trophy,
    condition: (stats) => stats.pomodorosCompleted >= 25
  },
  {
    id: "500_minutes",
    name: "Grind Mode",
    description: "focused for 500 total minutes",
    icon: Star,
    condition: (stats) => stats.totalMinutes >= 500
  },
  {
    id: "30_day_streak",
    name: "Consistency King",
    description: "maintained a 30-day streak",
    icon: Crown,
    condition: (stats) => stats.streakDays >= 30
  },
  {
    id: "1000_minutes",
    name: "Locked In",
    description: "focused for 1000 total minutes",
    icon: Rocket,
    condition: (stats) => stats.totalMinutes >= 1000
  },
  {
    id: "50_sessions",
    name: "Session Master",
    description: "completed 50 focus sessions",
    icon: Award,
    condition: (stats) => stats.totalSessions >= 50
  }
];

export const PLAYFUL_MESSAGES = [
  "nice grind",
  "locked in fr",
  "big brain energy",
  "we're so back",
  "touch grass later",
  "brain rotted enough for today",
  "study arc goes hard",
  "main character vibes"
];

export function getRandomMessage(): string {
  return PLAYFUL_MESSAGES[Math.floor(Math.random() * PLAYFUL_MESSAGES.length)];
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(level: number): number {
  return level * 100;
}

export function getCurrentLevelXP(xp: number): number {
  const level = calculateLevel(xp);
  return xp - (level - 1) * 100;
}
