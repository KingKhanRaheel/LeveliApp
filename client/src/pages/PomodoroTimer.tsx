import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import PomodoroIndicator from "@/components/PomodoroIndicator";
import SessionCompleteModal from "@/components/SessionCompleteModal";
import { useTimer } from "@/hooks/useTimer";
import { useGameState } from "@/hooks/useGameState";
import { getRandomMessage } from "@/lib/achievements";

type PomodoroMode = "focus" | "break" | "longBreak";

export default function PomodoroTimer() {
  const [, setLocation] = useLocation();
  
  // Load saved Pomodoro state
  const savedState = localStorage.getItem("pomodoro_state");
  const initialState = savedState ? JSON.parse(savedState) : { mode: "focus", cycle: 0, completedMinutes: 0 };
  
  const [mode, setMode] = useState<PomodoroMode>(initialState.mode);
  const [cycle, setCycle] = useState(initialState.cycle);
  const [completedMinutes, setCompletedMinutes] = useState(initialState.completedMinutes);
  
  const focusDuration = 25;
  const breakDuration = 5;
  const longBreakDuration = 15;
  
  const initialDuration = mode === "focus" ? focusDuration : mode === "break" ? breakDuration : longBreakDuration;
  const { minutes, seconds, isRunning, toggleTimer, reset, end, totalSeconds } = useTimer(initialDuration, "pomodoro_timer_state");
  const { completeSession } = useGameState();
  
  // Save Pomodoro state
  useEffect(() => {
    localStorage.setItem("pomodoro_state", JSON.stringify({ mode, cycle, completedMinutes }));
  }, [mode, cycle, completedMinutes]);
  
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
    
    // Always show modal
    if (totalCompleted > 0) {
      const pomodoroBonus = cycle > 0;
      const result = completeSession(totalCompleted, "pomodoro", pomodoroBonus);
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
    
    // Clear pomodoro state
    localStorage.removeItem("pomodoro_state");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setLocation("/");
    
    // Reset state
    setMode("focus");
    setCycle(0);
    setCompletedMinutes(0);
    localStorage.removeItem("pomodoro_state");
  };

  const getModeLabel = () => {
    if (mode === "focus") return "Focus Time";
    if (mode === "break") return "Break Time";
    return "Long Break";
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
        <span className="text-sm font-medium text-muted-foreground">Pomodoro</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-12">
        <div className="text-center space-y-6">
          <PomodoroIndicator totalCycles={4} currentCycle={cycle} />
          
          <p className="text-sm text-muted-foreground font-medium">
            {getModeLabel()}
          </p>
          
          <TimerDisplay minutes={minutes} seconds={seconds} />
        </div>

        <TimerControls
          isRunning={isRunning}
          onPlayPause={toggleTimer}
          onEnd={handleEnd}
        />
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
