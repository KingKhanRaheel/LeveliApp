import { Progress } from "@/components/ui/progress";

interface XPProgressBarProps {
  currentXP: number;
  xpForNextLevel: number;
  currentLevel: number;
  nextLevel: number;
}

export default function XPProgressBar({ currentXP, xpForNextLevel, currentLevel, nextLevel }: XPProgressBarProps) {
  const progress = (currentXP / xpForNextLevel) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-muted-foreground">Level {currentLevel}</span>
        <span className="text-muted-foreground">Level {nextLevel}</span>
      </div>
      <div className="relative">
        <Progress value={progress} className="h-4 bg-muted" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-10 transition-opacity" />
      </div>
      <div className="text-center text-xs text-muted-foreground font-medium">
        {currentXP} / {xpForNextLevel} XP
      </div>
    </div>
  );
}
