import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getRandomMessage, LEVEL_UP_MESSAGES } from "@/lib/content";
import { useEffect, useState } from "react";

interface LevelUpToastProps {
  show: boolean;
  newLevel: number;
  onComplete?: () => void;
}

export default function LevelUpToast({ show, newLevel, onComplete }: LevelUpToastProps) {
  const [message] = useState(getRandomMessage(LEVEL_UP_MESSAGES));

  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Glow pulse background */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-3xl rounded-full"
            />

            {/* Particle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i / 8) * Math.PI * 2) * 60,
                  y: Math.sin((i / 8) * Math.PI * 2) * 60,
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
              />
            ))}

            {/* Main content */}
            <div className="relative px-8 py-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary/40 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                >
                  <Sparkles className="w-12 h-12 text-primary fill-primary" />
                </motion.div>
                <p className="text-2xl font-display font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {message}
                </p>
                <p className="text-4xl font-display font-bold text-primary">
                  Level {newLevel}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
