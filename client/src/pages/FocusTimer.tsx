import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import MusicToggle from "@/components/MusicToggle";
import SessionCompleteModal from "@/components/SessionCompleteModal";
import StrictModeWarningModal from "@/components/StrictModeWarningModal";
import StrictModePrematureExitModal from "@/components/StrictModePrematureExitModal";
import DurationSelector from "@/components/DurationSelector";
import { useTimer } from "@/hooks/useTimer";
import { useGameState } from "@/hooks/useGameState";
import { MID_SESSION_MESSAGES, SESSION_COMPLETE_MESSAGES, getRandomMessage, getRandomInterval } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";
import LevelUpToast from "@/components/LevelUpToast";

// Request notification permission
const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export default function FocusTimer() {
  const [, setLocation] = useLocation();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [strictMode, setStrictMode] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showPrematureExitWarning, setShowPrematureExitWarning] = useState(false);
  const [showLevelUpToast, setShowLevelUpToast] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number } | null>(null);

  // Request notification permission when component mounts
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  
  const duration = selectedDuration || 25;
  const { completeSession, deductXP } = useGameState();
  
  const handleTimerComplete = () => {
    const minutesCompleted = duration;
    
    if (minutesCompleted > 0) {
      const result = completeSession(minutesCompleted, "focus");
      
      if (result.leveledUp && result.newLevel) {
        setLevelUpData({ newLevel: result.newLevel });
        setShowLevelUpToast(true);
        
        setTimeout(() => {
          setSessionResult({
            xpGained: result.xpGained,
            message: getRandomMessage(SESSION_COMPLETE_MESSAGES),
            leveledUp: result.leveledUp,
            newLevel: result.newLevel
          });
          setShowModal(true);
        }, 1500);
      } else {
        setSessionResult({
          xpGained: result.xpGained,
          message: getRandomMessage(SESSION_COMPLETE_MESSAGES),
          leveledUp: result.leveledUp,
          newLevel: result.newLevel
        });
        setShowModal(true);
      }
    }
  };
  
  const { minutes, seconds, isRunning, toggleTimer, end, reset } = useTimer(
    duration, 
    "focus_timer_state",
    { onTimerComplete: handleTimerComplete }
  );
  const [showModal, setShowModal] = useState(false);
  const [sessionResult, setSessionResult] = useState<{
    xpGained: number;
    message: string;
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  // Rotate motivational messages during countdown with random intervals
  useEffect(() => {
    if (isRunning) {
      const scheduleNextMessage = () => {
        const randomDelay = getRandomInterval(5, 10);
        const timeout = setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % MID_SESSION_MESSAGES.length);
          scheduleNextMessage();
        }, randomDelay);
        return timeout;
      };
      
      const timeout = scheduleNextMessage();
      return () => clearTimeout(timeout);
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

  const handleDurationSelect = (mins: number, strict?: boolean) => {
    setSelectedDuration(mins);
    setHasStarted(true);
    setStrictMode(strict || false);
    reset(mins);
  };

  // Enter fullscreen when timer starts if strict mode is on
  useEffect(() => {
    if (isRunning && strictMode) {
      const elem = document.documentElement;
      if (elem.requestFullscreen && !document.fullscreenElement) {
        elem.requestFullscreen().catch(() => {
          // Fullscreen request failed, continue anyway
        });
      }
    }
  }, [isRunning, strictMode]);

  const handleBackClick = () => {
    if (isRunning && strictMode) {
      setShowExitWarning(true);
    } else {
      setLocation("/");
    }
  };

  const confirmExit = () => {
    setShowExitWarning(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setLocation("/");
  };

  const confirmPrematureExit = () => {
    setShowPrematureExitWarning(false);
    const minutesFocused = minutes;
    end(); // End the timer
    
    // Deduct XP from total
    deductXP(minutesFocused);
    
    // Show loss notification
    const result = {
      xpGained: -minutesFocused,
      message: `Lost ${minutesFocused} XP. Don't fold next time.`,
      leveledUp: false
    };
    
    setSessionResult(result);
    setShowModal(true);
  };

  const handleEnd = () => {
    // Wrap It button: End the current focus session
    // In strict mode, show warning about XP loss before ending
    if (strictMode && isRunning) {
      setShowPrematureExitWarning(true);
      return;
    }

    // End the timer and get minutes completed
    const minutesCompleted = end();
    
    // Send completion notification to user
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Focus Session Complete!", {
          body: `You focused for ${minutesCompleted} minutes. Nice work!`,
          icon: "/favicon.png"
        });
      } catch (error) {
        console.log("Notification failed:", error);
      }
    }
    
    // Process session result and show appropriate modal
    if (minutesCompleted > 0) {
      const result = completeSession(minutesCompleted, "focus");
      
      // Show level-up toast if player leveled up during this session
      if (result.leveledUp && result.newLevel) {
        setLevelUpData({ newLevel: result.newLevel });
        setShowLevelUpToast(true);
        
        // Delay modal to show level-up toast first
        setTimeout(() => {
          setSessionResult({
            xpGained: result.xpGained,
            message: getRandomMessage(SESSION_COMPLETE_MESSAGES),
            leveledUp: result.leveledUp,
            newLevel: result.newLevel
          });
          setShowModal(true);
        }, 1500);
      } else {
        // Show session completion modal immediately
        setSessionResult({
          xpGained: result.xpGained,
          message: getRandomMessage(SESSION_COMPLETE_MESSAGES),
          leveledUp: result.leveledUp,
          newLevel: result.newLevel
        });
        setShowModal(true);
      }
    } else {
      // Session was too short to count
      setSessionResult({
        xpGained: 0,
        message: "too short, try again",
        leveledUp: false
      });
      setShowModal(true);
    }
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
          onClick={handleBackClick}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Focus Timer</span>
          {hasStarted && strictMode && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Strict
            </Badge>
          )}
        </div>
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
                    transition={{ duration: 0.4 }}
                    className="text-sm text-primary font-medium mb-4 min-h-[20px]"
                  >
                    {MID_SESSION_MESSAGES[messageIndex]}
                  </motion.p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4 font-semibold min-h-[20px]">
                    Ready to lock in?
                  </p>
                )}
              </AnimatePresence>
              <TimerDisplay minutes={minutes} seconds={seconds} />
            </div>

            <div className="space-y-4 w-full max-w-xs mx-auto">
              <TimerControls
                isRunning={isRunning}
                onPlayPause={toggleTimer}
                onEnd={handleEnd}
              />
              <div className="flex justify-center">
                <MusicToggle isTimerRunning={isRunning} />
              </div>
            </div>
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

      <StrictModeWarningModal
        open={showExitWarning}
        onConfirm={confirmExit}
        onCancel={() => setShowExitWarning(false)}
      />

      <StrictModePrematureExitModal
        open={showPrematureExitWarning}
        onConfirm={confirmPrematureExit}
        onCancel={() => setShowPrematureExitWarning(false)}
        minutesFocused={minutes}
        xpAtRisk={minutes}
      />

      {levelUpData && (
        <LevelUpToast
          show={showLevelUpToast}
          newLevel={levelUpData.newLevel}
          onComplete={() => setShowLevelUpToast(false)}
        />
      )}
    </div>
  );
}
