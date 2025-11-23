import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Lock } from "lucide-react";

interface AchievementBadgeProps {
  icon: LucideIcon;
  name: string;
  locked: boolean;
  progress?: number;
  onClick: () => void;
}

export default function AchievementBadge({ 
  icon: Icon, 
  name, 
  locked, 
  progress,
  onClick 
}: AchievementBadgeProps) {
  return (
    <Card
      className={`cursor-pointer hover-elevate active-elevate-2 transition-all ${
        locked ? 'opacity-50 grayscale' : 'bg-gradient-to-br from-card to-card/50'
      }`}
      onClick={onClick}
      data-testid={`achievement-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6 flex flex-col items-center gap-3">
        <div className="relative">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            locked 
              ? 'bg-muted' 
              : 'bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30'
          }`}>
            {locked ? (
              <Lock className="w-8 h-8 text-muted-foreground" />
            ) : (
              <Icon className="w-8 h-8 text-primary" />
            )}
          </div>
          {!locked && progress !== undefined && progress < 100 && (
            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-2">
              {progress}%
            </Badge>
          )}
        </div>
        <p className="text-sm font-semibold text-center line-clamp-2">{name}</p>
      </CardContent>
    </Card>
  );
}
