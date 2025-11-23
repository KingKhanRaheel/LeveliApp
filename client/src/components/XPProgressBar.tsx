import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface XPProgressBarProps {
  currentXP: number;
  xpForNextLevel: number;
  currentLevel: number;
  nextLevel: number;
}

export default function XPProgressBar({ currentXP, xpForNextLevel, currentLevel, nextLevel }: XPProgressBarProps) {
  const progress = (currentXP / xpForNextLevel) * 100;
  const xpRemaining = xpForNextLevel - currentXP;

  // Dynamic message based on progress
  const dynamicMessage = useMemo(() => {
    if (xpRemaining <= 10) return `${xpRemaining} XP left – almost there!`;
    if (xpRemaining <= 30) return `${xpRemaining} XP left to Level ${nextLevel} – keep going!`;
    if (progress >= 50) return `${xpRemaining} XP left to Level ${nextLevel}`;
    return `${xpRemaining} XP to Level ${nextLevel}`;
  }, [xpRemaining, nextLevel, progress]);

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-muted-foreground">Level {currentLevel}</span>
        <span className="text-muted-foreground">Level {nextLevel}</span>
      </div>
      <div className="relative">
        {/* Accessible progress bar with animations */}
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <Progress value={progress} className="h-4" />
          {/* Shimmer effect overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground/70 font-medium">
          {currentXP} / {xpForNextLevel} XP
        </span>
        <motion.span 
          className="text-primary font-bold"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          key={xpRemaining}
        >
          {dynamicMessage}
        </motion.span>
      </div>
    </div>
  );
}
