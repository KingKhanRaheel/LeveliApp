import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface BubbleTimerProps {
  totalSeconds: number;
  remainingSeconds: number;
  mode: "focus" | "break" | "longBreak";
  isRunning: boolean;
}

export default function BubbleTimer({ totalSeconds, remainingSeconds, mode, isRunning }: BubbleTimerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    setProgress(newProgress);
  }, [totalSeconds, remainingSeconds]);

  const isFocus = mode === "focus";
  const radius = 140;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = isFocus
    ? circumference - (progress / 100) * circumference
    : (progress / 100) * circumference;

  const bubbleColors = {
    focus: {
      gradient1: "#8B5CF6",
      gradient2: "#EC4899",
      glow: "rgba(139, 92, 246, 0.5)",
    },
    break: {
      gradient1: "#10B981",
      gradient2: "#3B82F6",
      glow: "rgba(16, 185, 129, 0.5)",
    },
    longBreak: {
      gradient1: "#F59E0B",
      gradient2: "#EF4444",
      glow: "rgba(245, 158, 11, 0.5)",
    },
  };

  const colors = bubbleColors[mode];
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="relative flex items-center justify-center" data-testid="bubble-timer">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <defs>
          <linearGradient id={`bubble-gradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.gradient1} />
            <stop offset="100%" stopColor={colors.gradient2} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          opacity={0.2}
        />

        <motion.circle
          stroke={`url(#bubble-gradient-${mode})`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          filter="url(#glow)"
          initial={false}
          animate={{
            strokeDashoffset: strokeDashoffset,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </svg>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={false}
        animate={{
          scale: isRunning ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isRunning ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <div className="text-7xl font-bold tabular-nums bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
          <div className="text-sm text-muted-foreground mt-2 font-medium">
            {isFocus ? (
              <span>filling up{isRunning && "..."}</span>
            ) : (
              <span>emptying{isRunning && "..."}</span>
            )}
          </div>
        </div>
      </motion.div>

      {isRunning && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
