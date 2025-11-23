import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "@/components/TimerControls";
import SessionCompleteModal from "@/components/SessionCompleteModal";
import { useTimer } from "@/hooks/useTimer";
import { useGameState } from "@/hooks/useGameState";
import { getRandomMessage } from "@/lib/achievements";

export default function FocusTimer() {
  const [, setLocation] = useLocation();
  const { minutes, seconds, isRunning, toggleTimer, end } = useTimer(25);
  const { completeSession } = useGameState();
  const [showModal, setShowModal] = useState(false);
  const [sessionResult, setSessionResult] = useState<{
    xpGained: number;
    message: string;
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);

  const handleEnd = () => {
    const minutesCompleted = end();
    if (minutesCompleted > 0) {
      const result = completeSession(minutesCompleted, "focus");
      setSessionResult({
        xpGained: result.xpGained,
        message: getRandomMessage(),
        leveledUp: result.leveledUp,
        newLevel: result.newLevel
      });
      setShowModal(true);
    } else {
      setLocation("/");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
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
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4 font-medium">
            {isRunning ? "Focus Time" : "Ready to focus?"}
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
