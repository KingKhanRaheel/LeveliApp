import { useState, useEffect, useRef } from "react";

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
}

export function useTimer(initialMinutes: number = 25) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalSeconds]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const reset = (newMinutes?: number) => {
    setIsRunning(false);
    setTotalSeconds((newMinutes || initialMinutes) * 60);
  };

  const end = () => {
    setIsRunning(false);
    return Math.floor((initialMinutes * 60 - totalSeconds) / 60);
  };

  return {
    minutes,
    seconds,
    isRunning,
    totalSeconds,
    toggleTimer,
    reset,
    end
  };
}
