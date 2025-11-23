import { useLocation } from "wouter";
import { Timer, Clock } from "lucide-react";
import LevelBadge from "@/components/LevelBadge";
import XPProgressBar from "@/components/XPProgressBar";
import StreakCounter from "@/components/StreakCounter";
import ActionCard from "@/components/ActionCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useGameState } from "@/hooks/useGameState";

export default function Home() {
  const [, setLocation] = useLocation();
  const { getStats } = useGameState();
  const stats = getStats();

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-lg mx-auto pt-8 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Leveli</h1>
            <p className="text-sm text-muted-foreground">locked in mode activated</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center gap-6">
          <LevelBadge level={stats.level} size="lg" />
          
          <div className="w-full">
            <XPProgressBar
              currentXP={stats.currentLevelXP}
              xpForNextLevel={stats.xpForNextLevel}
              currentLevel={stats.level}
              nextLevel={stats.level + 1}
            />
          </div>

          <StreakCounter days={stats.streakDays} />
        </div>

        <div className="space-y-4">
          <ActionCard
            icon={Timer}
            label="Focus Timer"
            description="Continuous focus session"
            onClick={() => setLocation("/focus")}
          />
          <ActionCard
            icon={Clock}
            label="Pomodoro"
            description="25 min focus, 5 min break"
            onClick={() => setLocation("/pomodoro")}
          />
        </div>
      </div>
    </div>
  );
}
