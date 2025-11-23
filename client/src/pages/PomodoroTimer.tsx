import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import PomodoroIndicator from "@/components/PomodoroIndicator";
import SessionCompleteModal from "@/components/SessionCompleteModal";
import DurationSelector from "@/components/DurationSelector";
import BubbleTimer from "@/components/BubbleTimer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTimer } from "@/hooks/useTimer";
import { useGameState } from "@/hooks/useGameState";
import { getRandomMessage } from "@/lib/achievements";

type PomodoroMode = "focus" | "break" | "longBreak";

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
  
  const [focusDuration, setFocusDuration] = useState(initialState.focusDuration);
  const [breakDuration, setBreakDuration] = useState(initialState.breakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(initialState.longBreakDuration);
  
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
    setHasStarted(false);
    setLocation("/");
    
    // Reset state
    setMode("focus");
    setCycle(0);
    setCompletedMinutes(0);
    localStorage.removeItem("pomodoro_state");
    localStorage.removeItem("pomodoro_timer_state");
  };

  const handleDurationSelect = (mins: number) => {
    setFocusDuration(mins);
    setHasStarted(true);
    setShowSettings(false);
    reset(mins);
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
          <DurationSelector onSelect={handleDurationSelect} defaultMinutes={25} type="focus" />
        ) : (
          <>
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {getModeLabel()}
                </p>
                <PomodoroIndicator totalCycles={4} currentCycle={cycle} />
              </div>
              
              <BubbleTimer
                totalSeconds={initialDuration * 60}
                remainingSeconds={totalSeconds}
                mode={mode}
                isRunning={isRunning}
              />
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
