import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { useState, useEffect } from "react";
import { ambientMusicPlayer } from "@/lib/sounds";

interface MusicToggleProps {
  isTimerRunning: boolean;
}

export default function MusicToggle({ isTimerRunning }: MusicToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isTimerRunning && isPlaying) {
      ambientMusicPlayer.stop();
      setIsPlaying(false);
    }
  }, [isTimerRunning, isPlaying]);

  const handleToggle = async () => {
    if (!isTimerRunning) return;
    
    if (isPlaying) {
      ambientMusicPlayer.stop();
      setIsPlaying(false);
    } else {
      await ambientMusicPlayer.start();
      setIsPlaying(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={!isTimerRunning}
      className="gap-2"
      data-testid="button-music-toggle"
    >
      <Music className={`w-4 h-4 ${isPlaying ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-xs">{isPlaying ? "Music On" : "Ambient"}</span>
    </Button>
  );
}
