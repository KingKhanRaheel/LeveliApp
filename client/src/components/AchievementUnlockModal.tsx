import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { soundManager } from "@/lib/sounds";

interface AchievementUnlockModalProps {
  achievementIds: string[];
  onClose: () => void;
}

export default function AchievementUnlockModal({ achievementIds, onClose }: AchievementUnlockModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const currentAchievement = achievementIds.length > 0 
    ? ACHIEVEMENTS.find(a => a.id === achievementIds[currentIndex])
    : null;

  // Play sound when modal opens
  useEffect(() => {
    if (currentAchievement && !hasPlayedSound) {
      soundManager.resumeContext();
      soundManager.playAchievementUnlock();
      setHasPlayedSound(true);
    }
  }, [currentAchievement, hasPlayedSound]);

  const handleNext = () => {
    if (currentIndex < achievementIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasPlayedSound(false); // Reset to play sound for next achievement
    } else {
      onClose();
    }
  };

  if (!currentAchievement) return null;

  const isLast = currentIndex === achievementIds.length - 1;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-achievement-unlock">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <DialogTitle className="text-center text-3xl font-display font-bold flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-primary" />
              Achievement Unlocked!
            </DialogTitle>
          </motion.div>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAchievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-4"
            >
              {/* Achievement Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200 
                }}
                className="flex justify-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/40 flex items-center justify-center">
                  {typeof currentAchievement.icon === 'string' ? (
                    <span className="text-5xl">{currentAchievement.icon}</span>
                  ) : (
                    <currentAchievement.icon className="w-12 h-12 text-primary" />
                  )}
                </div>
              </motion.div>

              {/* Achievement Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {currentAchievement.name}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {currentAchievement.description}
                </p>
              </motion.div>

              {/* Progress indicator if multiple achievements */}
              {achievementIds.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2"
                >
                  {achievementIds.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        idx === currentIndex 
                          ? 'bg-primary' 
                          : idx < currentIndex 
                          ? 'bg-primary/40' 
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleNext}
              className="w-full"
              size="lg"
              data-testid="button-achievement-continue"
            >
              {isLast ? 'Awesome!' : `Next (${currentIndex + 1}/${achievementIds.length})`}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
