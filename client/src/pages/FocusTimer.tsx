import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import SessionCompleteModal from "@/components/SessionCompleteModal";
import DurationSelector from "@/components/DurationSelector";
import { useTimer } from "@/hooks/useTimer";
import { useGameState } from "@/hooks/useGameState";
import { getRandomMessage } from "@/lib/achievements";
import { motion, AnimatePresence } from "framer-motion";

// Motivational messages that rotate during focus
const MOTIVATIONAL_MESSAGES = [
  "Brain cells activated",
  "No scrolling. Stay locked.",
  "Future you will thank you.",
  "Focus mode engaged",
  "You're doing great",
  "Deep work in progress"
];

export default function FocusTimer() {
  const [, setLocation] = useLocation();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  
  const duration = selectedDuration || 25;
  const { minutes, seconds, isRunning, toggleTimer, end, reset } = useTimer(duration, "focus_timer_state");
  const { completeSession } = useGameState();
  const [showModal, setShowModal] = useState(false);
  const [sessionResult, setSessionResult] = useState<{
    xpGained: number;
    message: string;
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  // Rotate motivational messages during countdown
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
      }, 8000); // Change message every 8 seconds
      return () => clearInterval(interval);
    } else {
      // Reset message index when timer stops
      setMessageIndex(0);
    }
  }, [isRunning]);

  // Check if timer has been started
  useEffect(() => {
    const saved = localStorage.getItem("focus_timer_state");
    if (saved) {
      setHasStarted(true);
      const state = JSON.parse(saved);
      if (state.initialDuration) {
        setSelectedDuration(state.initialDuration / 60);
      }
    }
  }, []);

  const handleDurationSelect = (mins: number) => {
    setSelectedDuration(mins);
    setHasStarted(true);
    reset(mins);
  };

  const handleEnd = () => {
    const minutesCompleted = end();
    
    // Always show modal, even for 0 minutes
    if (minutesCompleted > 0) {
      const result = completeSession(minutesCompleted, "focus");
      setSessionResult({
        xpGained: result.xpGained,
        message: getRandomMessage(),
        leveledUp: result.leveledUp,
        newLevel: result.newLevel
      });
    } else {
      setSessionResult({
        xpGained: 0,
        message: "too short, try again",
        leveledUp: false
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setHasStarted(false);
    setSelectedDuration(null);
    localStorage.removeItem("focus_timer_state");
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">Focus Timer</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-12">
        {!hasStarted ? (
          <DurationSelector onSelect={handleDurationSelect} defaultMinutes={25} type="focus" />
        ) : (
          <>
            <div className="text-center space-y-6">
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="text-sm text-primary font-bold mb-4"
                  >
                    {MOTIVATIONAL_MESSAGES[messageIndex]}
                  </motion.p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4 font-semibold">
                    Ready to focus?
                  </p>
                )}
              </AnimatePresence>
              <TimerDisplay minutes={minutes} seconds={seconds} />
            </div>

            <TimerControls
              isRunning={isRunning}
              onPlayPause={toggleTimer}
              onEnd={handleEnd}
            />
          </>
        )}
      </div>

      {sessionResult && (
        <SessionCompleteModal
          open={showModal}
          onClose={handleModalClose}
          xpGained={sessionResult.xpGained}
          message={sessionResult.message}
          leveledUp={sessionResult.leveledUp}
          newLevel={sessionResult.newLevel}
        />
      )}
    </div>
  );
}
