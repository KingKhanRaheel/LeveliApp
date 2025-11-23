import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
      <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
      <span className="font-display font-semibold text-lg">{days}</span>
      <span className="text-sm text-muted-foreground">day streak</span>
    </div>
  );
}
