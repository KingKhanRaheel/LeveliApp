import { Flame, Swords, Skull } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  // Dynamic icons and colors based on streak length
  const streakConfig = useMemo(() => {
    if (days >= 7) {
      return {
        icons: [Skull, Flame],
        gradient: "from-purple-500/15 to-red-500/15",
        border: "border-purple-500/30",
        iconColor: "text-purple-500",
        fillColor: "fill-purple-500",
        message: "on fire!"
      };
    } else if (days >= 3) {
      return {
        icons: [Swords, Flame],
        gradient: "from-orange-500/15 to-yellow-500/15",
        border: "border-orange-500/30",
        iconColor: "text-orange-500",
        fillColor: "fill-orange-500",
        message: "keep it up"
      };
    } else {
      return {
        icons: [Flame],
        gradient: "from-orange-500/10 to-red-500/10",
        border: "border-orange-500/20",
        iconColor: "text-orange-500",
        fillColor: "fill-orange-500",
        message: "day streak"
      };
    }
  }, [days]);

  return (
    <motion.div 
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${streakConfig.gradient} border ${streakConfig.border}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      key={days}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        duration: 0.7
      }}
    >
      {/* Animated icons */}
      <div className="flex items-center gap-1">
        {streakConfig.icons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 400,
              damping: 12
            }}
          >
            <Icon className={`w-5 h-5 ${streakConfig.iconColor} ${streakConfig.fillColor}`} />
          </motion.div>
        ))}
      </div>
      
      {/* Animated counter */}
      <motion.span 
        className="font-display font-bold text-xl"
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={`count-${days}`}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15
        }}
      >
        {days}
      </motion.span>
      
      <span className="text-sm text-muted-foreground font-medium">{streakConfig.message}</span>
    </motion.div>
  );
}
