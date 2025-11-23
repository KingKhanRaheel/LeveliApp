import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Zap, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";

interface SessionCompleteModalProps {
  open: boolean;
  onClose: () => void;
  xpGained: number;
  message: string;
  leveledUp?: boolean;
  newLevel?: number;
}

export default function SessionCompleteModal({
  open,
  onClose,
  xpGained,
  message,
  leveledUp,
  newLevel
}: SessionCompleteModalProps) {
  const { getStats } = useGameState();
  const stats = getStats();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-session-complete">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <DialogTitle className="text-center text-3xl font-display font-bold flex items-center justify-center gap-3">
              {leveledUp ? (
                <>
                  <Trophy className="w-8 h-8 text-primary" />
                  Level Up!
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 text-primary" />
                  Session Complete
                </>
              )}
            </DialogTitle>
          </motion.div>
          <DialogDescription className="sr-only">
            Session completion summary with XP gained and level progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* Playful message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-lg text-foreground font-semibold"
          >
            {message}
          </motion.p>
          
          {/* XP gained with glow animation */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 12
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 blur-3xl opacity-30 rounded-full" />
            <div className="relative flex items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/30">
              <Zap className="w-8 h-8 text-primary fill-primary" />
              <span className="text-6xl font-display font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                +{xpGained}
              </span>
              <span className="text-2xl font-bold text-muted-foreground">XP</span>
            </div>
          </motion.div>

          {/* Streak status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
          >
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="font-semibold text-lg">{stats.streakDays}</span>
            <span className="text-sm text-muted-foreground">day streak</span>
          </motion.div>

          {/* Level up notification */}
          {leveledUp && newLevel && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.5,
                type: "spring",
                stiffness: 200
              }}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/40"
            >
              <p className="text-sm text-muted-foreground font-semibold mb-2">You reached</p>
              <p className="text-4xl font-display font-bold text-primary flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" />
                Level {newLevel}
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onClose}
              className="w-full"
              size="lg"
              data-testid="button-continue"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
