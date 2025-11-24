import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { BUTTON_LABELS } from "@/lib/content";

interface TimerControlsProps {
  isRunning: boolean;
  onPlayPause: () => void;
  onEnd: () => void;
}

export default function TimerControls({ isRunning, onPlayPause, onEnd }: TimerControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        size="icon"
        onClick={onPlayPause}
        data-testid="button-play-pause"
        className="w-20 h-20 rounded-full shadow-lg"
      >
        {isRunning ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </Button>
      
      <Button
        variant="ghost"
        onClick={onEnd}
        data-testid="button-end-session"
        className="text-sm"
      >
        <Square className="w-4 h-4 mr-2" />
        {BUTTON_LABELS.endSession}
      </Button>
    </div>
  );
}
