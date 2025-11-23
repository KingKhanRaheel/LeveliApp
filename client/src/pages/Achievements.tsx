import { useState } from "react";
import AchievementBadge from "@/components/AchievementBadge";
import { ACHIEVEMENTS, GameStats } from "@/lib/achievements";
import { useGameState } from "@/hooks/useGameState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Achievements() {
  const { getStats, progress } = useGameState();
  const stats = getStats();
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const gameStats: GameStats = {
    totalMinutes: stats.totalMinutes,
    totalSessions: stats.totalSessions,
    streakDays: stats.streakDays,
    pomodorosCompleted: progress.pomodorosCompleted,
    dailyMinutes: stats.dailyMinutes
  };

  const getProgress = (achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return 0;

    if (achievementId === "first_session") {
      return Math.min(100, (stats.totalSessions / 1) * 100);
    } else if (achievementId === "100_minutes") {
      return Math.min(100, (stats.totalMinutes / 100) * 100);
    } else if (achievementId === "3_hours_day") {
      return Math.min(100, (stats.dailyMinutes / 180) * 100);
    } else if (achievementId === "7_day_streak") {
      return Math.min(100, (stats.streakDays / 7) * 100);
    } else if (achievementId === "25_pomodoros") {
      return Math.min(100, (progress.pomodorosCompleted / 25) * 100);
    } else if (achievementId === "500_minutes") {
      return Math.min(100, (stats.totalMinutes / 500) * 100);
    } else if (achievementId === "30_day_streak") {
      return Math.min(100, (stats.streakDays / 30) * 100);
    } else if (achievementId === "1000_minutes") {
      return Math.min(100, (stats.totalMinutes / 1000) * 100);
    } else if (achievementId === "50_sessions") {
      return Math.min(100, (stats.totalSessions / 50) * 100);
    }
    return 0;
  };

  const selected = ACHIEVEMENTS.find(a => a.id === selectedAchievement);

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-lg mx-auto pt-8 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Achievements</h1>
          <p className="text-sm text-muted-foreground">
            {stats.achievements.length} / {ACHIEVEMENTS.length} unlocked
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = stats.achievements.includes(achievement.id);
            const progress = getProgress(achievement.id);

            return (
              <AchievementBadge
                key={achievement.id}
                icon={achievement.icon}
                name={achievement.name}
                locked={!isUnlocked}
                progress={!isUnlocked ? Math.floor(progress) : undefined}
                onClick={() => setSelectedAchievement(achievement.id)}
              />
            );
          })}
        </div>

        {selected && (
          <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                    stats.achievements.includes(selected.id)
                      ? 'bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30'
                      : 'bg-muted'
                  }`}>
                    <selected.icon className="w-10 h-10 text-primary" />
                  </div>
                  <DialogTitle className="text-2xl font-display text-center">
                    {selected.name}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">
                  {selected.description}
                </p>
                {stats.achievements.includes(selected.id) ? (
                  <p className="text-sm text-primary font-medium">
                    Unlocked!
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(getProgress(selected.id))}% complete
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
