export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockRequirement?: {
    type: "achievement" | "level" | "free";
    value: string | number;
  };
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    card: string;
    background: string;
    muted: string;
  };
  darkColors?: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    card: string;
    background: string;
    muted: string;
  };
}

export const themes: Theme[] = [
  {
    id: "default",
    name: "Purple Haze",
    description: "Classic purple vibes",
    icon: "🟣",
    unlockRequirement: { type: "free", value: 0 },
    colors: {
      primary: "262 83% 58%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "262 8% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "262 75% 65%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "262 6% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "ocean",
    name: "Ocean Wave",
    description: "Cool blue depths",
    icon: "🌊",
    unlockRequirement: { type: "free", value: 0 },
    colors: {
      primary: "200 80% 50%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "200 10% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "200 75% 60%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "200 8% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    description: "Warm orange & pink",
    icon: "🌅",
    unlockRequirement: { type: "free", value: 0 },
    colors: {
      primary: "15 85% 55%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "15 10% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "15 80% 60%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "15 8% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "forest",
    name: "Forest Zen",
    description: "Peaceful green nature",
    icon: "🌲",
    unlockRequirement: { type: "achievement", value: "7_day_streak" },
    colors: {
      primary: "140 75% 45%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "140 10% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "140 70% 55%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "140 8% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "neon",
    name: "Neon Nights",
    description: "Electric cyberpunk",
    icon: "⚡",
    unlockRequirement: { type: "achievement", value: "500_minutes" },
    colors: {
      primary: "280 90% 60%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "280 15% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "280 100% 70%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "280 10% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "pastel",
    name: "Pastel Dreams",
    description: "Soft & aesthetic",
    icon: "🌸",
    unlockRequirement: { type: "achievement", value: "30_day_streak" },
    colors: {
      primary: "320 60% 70%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "320 15% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "320 55% 75%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "320 10% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "gold",
    name: "Golden Hour",
    description: "Luxury gold accents",
    icon: "✨",
    unlockRequirement: { type: "level", value: 10 },
    colors: {
      primary: "45 90% 55%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "45 15% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "45 85% 60%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "45 10% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    description: "Deep blue mystery",
    icon: "🌙",
    unlockRequirement: { type: "achievement", value: "1000_minutes" },
    colors: {
      primary: "230 70% 50%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 90%",
      accent: "230 12% 93%",
      card: "0 0% 98%",
      background: "0 0% 100%",
      muted: "0 3% 92%",
    },
    darkColors: {
      primary: "230 65% 60%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 17%",
      accent: "230 8% 14%",
      card: "0 0% 9%",
      background: "0 0% 7%",
      muted: "0 2% 15%",
    },
  },
];

export function isThemeUnlocked(theme: Theme, achievements: string[], level: number): boolean {
  if (!theme.unlockRequirement) return true;
  
  switch (theme.unlockRequirement.type) {
    case "free":
      return true;
    case "achievement":
      return achievements.includes(theme.unlockRequirement.value as string);
    case "level":
      return level >= (theme.unlockRequirement.value as number);
    default:
      return false;
  }
}

export function applyTheme(theme: Theme, isDark: boolean) {
  const root = document.documentElement;
  const colors = isDark && theme.darkColors ? theme.darkColors : theme.colors;
  
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--secondary", colors.secondary);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--muted", colors.muted);
}
