import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import MusicToggle from "@/components/MusicToggle";
import PomodoroIndicator from "@/components/PomodoroIndicator";
import SessionCompleteModal from "@/components/SessionCompleteModal";
import StrictModeWarningModal from "@/components/StrictModeWarningModal";
import StrictModePrematureExitModal from "@/components/StrictModePrematureExitModal";
import DurationSelector from "@/components/DurationSelector";
import BubbleTimer from "@/components/BubbleTimer";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTimer } from "@/hooks/useTimer";
import { useGameState } from "@/hooks/useGameState";
import { MID_SESSION_MESSAGES, SESSION_COMPLETE_MESSAGES, getRandomMessage, getRandomInterval } from "@/lib/content";
import { motion, AnimatePresence } from "framer-motion";
import LevelUpToast from "@/components/LevelUpToast";

type PomodoroMode = "focus" | "break" | "longBreak";

// Request notification permission
const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

export default function PomodoroTimer() {
  const [, setLocation] = useLocation();
  
  // Load saved Pomodoro state
  const savedState = localStorage.getItem("pomodoro_state");
  const initialState = savedState ? JSON.parse(savedState) : { 
    mode: "focus", 
    cycle: 0, 
    completedMinutes: 0,
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15
  };
  
  const [mode, setMode] = useState<PomodoroMode>(initialState.mode);
  const [cycle, setCycle] = useState(initialState.cycle);
  const [completedMinutes, setCompletedMinutes] = useState(initialState.completedMinutes);
  const [hasStarted, setHasStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [strictMode, setStrictMode] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showPrematureExitWarning, setShowPrematureExitWarning] = useState(false);
  const [showLevelUpToast, setShowLevelUpToast] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number } | null>(null);
  
  const [focusDuration, setFocusDuration] = useState(initialState.focusDuration);
  const [breakDuration, setBreakDuration] = useState(initialState.breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(initialState.longBreakDuration);

  // Request notification permission when component mounts
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  
  const initialDuration = mode === "focus" ? focusDuration : mode === "break" ? breakDuration : longBreakDuration;
  const { minutes, seconds, isRunning, toggleTimer, reset, end, totalSeconds } = useTimer(initialDuration, "pomodoro_timer_state");
  const { completeSession } = useGameState();

  // Check if timer has been started
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro_timer_state");
    if (saved) {
      setHasStarted(true);
    }
  }, []);

  // Rotate motivational messages during focus mode with random intervals
  useEffect(() => {
    if (isRunning && mode === "focus") {
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
      setMessageIndex(0);
    }
  }, [isRunning, mode]);
  
  // Save Pomodoro state
  useEffect(() => {
    localStorage.setItem("pomodoro_state", JSON.stringify({ 
      mode, 
      cycle, 
      completedMinutes,
      focusDuration,
      breakDuration,
      longBreakDuration
    }));
  }, [mode, cycle, completedMinutes, focusDuration, breakDuration, longBreakDuration]);
  
  const [showModal, setShowModal] = useState(false);
  const [sessionResult, setSessionResult] = useState<{
    xpGained: number;
    message: string;
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  useEffect(() => {
    if (totalSeconds === 0 && mode === "focus") {
      setCompletedMinutes((prev: number) => prev + focusDuration);
      
      if (cycle === 3) {
        setMode("longBreak");
        reset(longBreakDuration);
      } else {
        setMode("break");
        reset(breakDuration);
      }
    } else if (totalSeconds === 0 && (mode === "break" || mode === "longBreak")) {
      const newCycle = mode === "longBreak" ? 0 : cycle + 1;
      setCycle(newCycle);
      setMode("focus");
      reset(focusDuration);
    }
  }, [totalSeconds, mode, cycle, reset]);

  const handleEnd = () => {
    const minutesDone = end();
    const totalCompleted = completedMinutes + (mode === "focus" ? minutesDone : 0);
    
    // Send notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro Complete!", {
        body: `You completed ${totalCompleted} minutes of focused work!`,
        icon: "/favicon.png"
      });
    }
    
    // Always show modal
    if (totalCompleted > 0) {
      const pomodoroBonus = cycle > 0;
      const result = completeSession(totalCompleted, "pomodoro", pomodoroBonus);
      
      // Show level-up toast if leveled up
      if (result.leveledUp && result.newLevel) {
        setLevelUpData({ newLevel: result.newLevel });
        setShowLevelUpToast(true);
        
        // Show session modal after level-up toast
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
    } else {
      setSessionResult({
        xpGained: 0,
        message: "too short, try again",
        leveledUp: false
      });
      setShowModal(true);
    }
    
    // Clear pomodoro state
    localStorage.removeItem("pomodoro_state");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setHasStarted(false);
    setLocation("/");
    
    // Reset state
    setMode("focus");
    setCycle(0);
    setCompletedMinutes(0);
    localStorage.removeItem("pomodoro_state");
    localStorage.removeItem("pomodoro_timer_state");
  };

  const handleDurationSelect = (mins: number, strict?: boolean) => {
    setFocusDuration(mins);
    setHasStarted(true);
    setShowSettings(false);
    setStrictMode(strict || false);
    reset(mins);
  };

  // Enter fullscreen when timer starts if strict mode is on
  useEffect(() => {
    if (isRunning && strictMode && mode === "focus") {
      const elem = document.documentElement;
      if (elem.requestFullscreen && !document.fullscreenElement) {
        elem.requestFullscreen().catch(() => {
          // Fullscreen request failed, continue anyway
        });
      }
    }
  }, [isRunning, strictMode, mode]);

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

  const getModeLabel = () => {
    if (mode === "focus") return "Focus Time";
    if (mode === "break") return "Fine. Take a Break.";
    return "Fine. Take a Break.";
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
          <span className="text-sm font-medium text-muted-foreground">Pomodoro</span>
          {hasStarted && strictMode && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Strict
            </Badge>
          )}
        </div>
        {hasStarted && !isRunning && (
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Pomodoro Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Focus Duration</h4>
                  <div className="flex gap-2">
                    {[15, 25, 45, 60].map((mins) => (
                      <Button
                        key={mins}
                        variant={focusDuration === mins ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFocusDuration(mins)}
                        data-testid={`button-focus-${mins}`}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Break Duration</h4>
                  <div className="flex gap-2">
                    {[5, 10, 15].map((mins) => (
                      <Button
                        key={mins}
                        variant={breakDuration === mins ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBreakDuration(mins)}
                        data-testid={`button-break-${mins}`}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Long Break Duration</h4>
                  <div className="flex gap-2">
                    {[15, 20, 30].map((mins) => (
                      <Button
                        key={mins}
                        variant={longBreakDuration === mins ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLongBreakDuration(mins)}
                        data-testid={`button-longbreak-${mins}`}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={() => setShowSettings(false)} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {!hasStarted && <div className="w-10" />}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-12">
        {!hasStarted ? (
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Pomodoro Setup</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Focus Duration</label>
                <div className="text-center mb-4">
                  <span className="text-6xl font-bold text-primary">{focusDuration}</span>
                  <span className="text-lg text-muted-foreground ml-2">min</span>
                </div>
                <Slider
                  value={[focusDuration]}
                  onValueChange={(value) => setFocusDuration(value[0])}
                  min={15}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-3 block">Break Duration</label>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-primary">{breakDuration}</span>
                  <span className="text-sm text-muted-foreground ml-2">min</span>
                </div>
                <Slider
                  value={[breakDuration]}
                  onValueChange={(value) => setBreakDuration(value[0])}
                  min={5}
                  max={15}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <Button
                onClick={() => handleDurationSelect(focusDuration)}
                className="w-full"
                size="lg"
              >
                Start Pomodoro
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {getModeLabel()}
                </p>
                <PomodoroIndicator totalCycles={4} currentCycle={cycle} />
              </div>
              
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {isRunning && mode === "focus" ? (
                    <motion.p
                      key={messageIndex}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                      className="text-sm text-primary font-medium min-h-[20px]"
                    >
                      {MID_SESSION_MESSAGES[messageIndex]}
                    </motion.p>
                  ) : (
                    <div className="min-h-[20px]" />
                  )}
                </AnimatePresence>
                
                <BubbleTimer
                  totalSeconds={initialDuration * 60}
                  remainingSeconds={totalSeconds}
                  mode={mode}
                  isRunning={isRunning}
                />
              </div>
            </div>

            <div className="space-y-4 w-full max-w-xs mx-auto">
              <TimerControls
                isRunning={isRunning}
                onPlayPause={toggleTimer}
                onEnd={handleEnd}
              />
              {mode === "focus" && (
                <div className="flex justify-center">
                  <MusicToggle isTimerRunning={isRunning} />
                </div>
              )}
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
