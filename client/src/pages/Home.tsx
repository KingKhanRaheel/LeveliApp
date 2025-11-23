import { useLocation } from "wouter";
import { Timer, Clock, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LevelBadge from "@/components/LevelBadge";
import XPProgressBar from "@/components/XPProgressBar";
import StreakCounter from "@/components/StreakCounter";
import ActionCard from "@/components/ActionCard";
import ThemeToggle from "@/components/ThemeToggle";
import ThemeSelector from "@/components/ThemeSelector";
import AchievementUnlockModal from "@/components/AchievementUnlockModal";
import { useGameState } from "@/hooks/useGameState";
import { soundManager } from "@/lib/sounds";

export default function Home() {
  const [, setLocation] = useLocation();
  const { getStats } = useGameState();
  const stats = getStats();
  
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  // Check for pending achievements when page loads
  useEffect(() => {
    const pending = sessionStorage.getItem("pending_achievements");
    if (pending) {
      const achievements = JSON.parse(pending);
      if (achievements.length > 0) {
        setPendingAchievements(achievements);
        sessionStorage.removeItem("pending_achievements");
      }
    }
    
    // Trigger XP animation when returning to home
    setShowXPAnimation(true);
    soundManager.resumeContext();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-pink-500/5 pointer-events-none" />
      
      <motion.div 
        className="max-w-lg mx-auto pt-8 space-y-8 relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-display font-bold mb-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Leveli
            </h1>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              <p className="text-sm text-muted-foreground">locked in mode activated</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <ThemeToggle />
          </div>
        </motion.div>

        <motion.div variants={item} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-3xl blur-2xl" />
          <div className="relative flex flex-col items-center gap-6 p-6 bg-card/50 backdrop-blur-sm rounded-3xl border border-card-border">
            <LevelBadge level={stats.level} size="lg" />
            
            <div className="w-full">
              <XPProgressBar
                currentXP={stats.currentLevelXP}
                xpForNextLevel={stats.xpForNextLevel}
                currentLevel={stats.level}
                nextLevel={stats.level + 1}
                animate={showXPAnimation}
              />
            </div>

            <StreakCounter days={stats.streakDays} />
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          {/* Quick Start Button */}
          <button
            onClick={() => setLocation("/focus")}
            data-testid="button-quick-start"
            className="w-full p-6 rounded-2xl bg-gradient-to-r from-primary to-purple-600 border border-primary-border text-primary-foreground font-bold text-lg shadow-lg hover-elevate active-elevate-2"
          >
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 fill-current" />
              Quick 25 min session
            </div>
          </button>

          <h2 className="text-base font-medium text-foreground flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Or choose your mode
          </h2>
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
              description="Work + break cycles"
              onClick={() => setLocation("/pomodoro")}
            />
          </div>
        </motion.div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      
      {/* Achievement unlock modal */}
      {pendingAchievements.length > 0 && (
        <AchievementUnlockModal
          achievementIds={pendingAchievements}
          onClose={() => setPendingAchievements([])}
        />
      )}
    </div>
  );
}
