import { useState } from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { themes, isThemeUnlocked, applyTheme } from "@/lib/themes";
import { useGameState } from "@/hooks/useGameState";

export default function ThemeSelector() {
  const [open, setOpen] = useState(false);
  const { getStats } = useGameState();
  const stats = getStats();
  
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem("selected_theme") || "default";
  });

  const handleThemeChange = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    if (!isThemeUnlocked(theme, stats.achievements, stats.level)) return;
    
    setSelectedTheme(themeId);
    localStorage.setItem("selected_theme", themeId);
    
    const isDark = document.documentElement.classList.contains("dark");
    applyTheme(theme, isDark);
  };

  const getUnlockText = (theme: typeof themes[0]) => {
    if (!theme.unlockRequirement) return "";
    
    switch (theme.unlockRequirement.type) {
      case "free":
        return "Free";
      case "achievement": {
        const achievementNames: Record<string, string> = {
          "7_day_streak": "Week Warrior",
          "500_minutes": "Grind Mode",
          "30_day_streak": "Consistency King",
          "1000_minutes": "Locked In",
        };
        return `Unlock: ${achievementNames[theme.unlockRequirement.value as string] || theme.unlockRequirement.value}`;
      }
      case "level":
        return `Unlock: Level ${theme.unlockRequirement.value}`;
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-theme-selector">
          <Sparkles className="w-4 h-4 mr-2" />
          Themes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Choose Your Vibe
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {themes.map((theme) => {
            const unlocked = isThemeUnlocked(theme, stats.achievements, stats.level);
            const isSelected = selectedTheme === theme.id;
            
            return (
              <motion.button
                key={theme.id}
                onClick={() => unlocked && handleThemeChange(theme.id)}
                disabled={!unlocked}
                className={`relative p-4 rounded-md border-2 transition-all min-h-[160px] flex flex-col ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : unlocked
                    ? "border-card-border hover:border-primary/30"
                    : "border-card-border bg-muted/40 cursor-not-allowed opacity-60"
                }`}
                whileHover={unlocked ? { scale: 1.02 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
                data-testid={`button-theme-${theme.id}`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                
                {!unlocked && (
                  <div className="absolute top-2 left-2">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 overflow-hidden">
                  <div className="text-3xl mb-1">{theme.icon}</div>
                  <div className="w-full px-1">
                    <h4 className="font-semibold text-sm leading-tight truncate">{theme.name}</h4>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                      {theme.description}
                    </p>
                  </div>
                  
                  {theme.unlockRequirement && theme.unlockRequirement.type !== "free" && (
                    <div className="mt-auto pt-2">
                      <Badge variant={unlocked ? "default" : "secondary"} className="text-xs">
                        {unlocked ? "Unlocked" : getUnlockText(theme)}
                      </Badge>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl border border-primary/20">
          <p className="text-sm text-foreground font-bold text-center">
            Unlock more themes by completing achievements and leveling up
          </p>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Current level: {stats.level} • Achievements: {stats.achievements.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
