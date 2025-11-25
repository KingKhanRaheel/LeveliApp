import { useState, useEffect, useRef, useCallback } from "react";
import { soundManager } from "@/lib/sounds";
import { sendMessageToSW, requestNotificationPermission } from "@/lib/serviceWorker";

export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
}

interface StoredTimerState {
  remainingSeconds: number;
  isRunning: boolean;
  startTimestamp: number | null;
  startingSeconds: number | null; // What the timer was at when we pressed play
  initialDuration: number;
}

export interface TimerCallbacks {
  onTimerComplete?: () => void;
}

export function useTimer(
  initialMinutes: number = 25, 
  storageKey: string = "timer_state",
  callbacks?: TimerCallbacks
) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const startTimestampRef = useRef<number | null>(null);
  const startingSecondsRef = useRef<number | null>(null); // Track what value we started from
  const animationFrameRef = useRef<number | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const state: StoredTimerState = JSON.parse(saved);
        
        if (state.isRunning && state.startTimestamp && state.startingSeconds !== null) {
          // Calculate actual remaining time based on when timer started
          const elapsedMs = Date.now() - state.startTimestamp;
          const elapsedSeconds = Math.floor(elapsedMs / 1000);
          const remaining = Math.max(0, state.startingSeconds - elapsedSeconds);
          
          setTotalSeconds(remaining);
          setIsRunning(remaining > 0);
          startTimestampRef.current = state.startTimestamp;
          startingSecondsRef.current = state.startingSeconds;
        } else {
          setTotalSeconds(state.remainingSeconds);
          setIsRunning(false);
          startTimestampRef.current = null;
          startingSecondsRef.current = null;
        }
      } catch (e) {
        console.error("Failed to restore timer state:", e);
      }
    }
  }, [storageKey]);

  // High-precision timer using requestAnimationFrame
  useEffect(() => {
    const tick = () => {
      if (!isRunning || !startTimestampRef.current || startingSecondsRef.current === null) {
        return;
      }

      const elapsedMs = Date.now() - startTimestampRef.current;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const remaining = Math.max(0, startingSecondsRef.current - elapsedSeconds);
      
      // Update state
      setTotalSeconds(remaining);

      if (remaining <= 0) {
        setIsRunning(false);
        startTimestampRef.current = null;
        startingSecondsRef.current = null;
        
        // Play alarm sound when timer ends
        soundManager.playTimerEnd();
        
        // Send completion notification
        sendMessageToSW({
          type: 'UPDATE_TIMER_NOTIFICATION',
          remaining: 0,
          isRunning: false
        });
        
        const state: StoredTimerState = {
          remainingSeconds: 0,
          isRunning: false,
          startTimestamp: null,
          startingSeconds: null,
          initialDuration: initialMinutes * 60
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
        
        // Trigger auto-complete callback
        if (callbacks?.onTimerComplete) {
          callbacks.onTimerComplete();
        }
      } else {
        // Save state periodically
        const state: StoredTimerState = {
          remainingSeconds: remaining,
          isRunning: true,
          startTimestamp: startTimestampRef.current,
          startingSeconds: startingSecondsRef.current,
          initialDuration: initialMinutes * 60
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
        
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    if (isRunning && totalSeconds > 0) {
      animationFrameRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, storageKey, initialMinutes, callbacks]);
  
  // Update notification every 10 seconds when running
  useEffect(() => {
    if (!isRunning) {
      sendMessageToSW({ type: 'CLEAR_TIMER_NOTIFICATION' });
      return;
    }
    
    const updateNotification = () => {
      sendMessageToSW({
        type: 'UPDATE_TIMER_NOTIFICATION',
        remaining: totalSeconds,
        isRunning: true
      });
    };
    
    updateNotification();
    const interval = setInterval(updateNotification, 10000);
    
    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const toggleTimer = async () => {
    if (!isRunning) {
      // Request notification permission when starting timer
      await requestNotificationPermission();
      
      // Starting - set start timestamp to now and remember current totalSeconds
      const now = Date.now();
      startTimestampRef.current = now;
      startingSecondsRef.current = totalSeconds;
      setIsRunning(true);
      
      const state: StoredTimerState = {
        remainingSeconds: totalSeconds,
        isRunning: true,
        startTimestamp: now,
        startingSeconds: totalSeconds,
        initialDuration: initialMinutes * 60
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } else {
      // Pausing - keep current totalSeconds value
      startTimestampRef.current = null;
      startingSecondsRef.current = null;
      setIsRunning(false);
      
      const state: StoredTimerState = {
        remainingSeconds: totalSeconds,
        isRunning: false,
        startTimestamp: null,
        startingSeconds: null,
        initialDuration: initialMinutes * 60
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  };
  
  const reset = (newMinutes?: number) => {
    setIsRunning(false);
    startTimestampRef.current = null;
    startingSecondsRef.current = null;
    const newDuration = (newMinutes || initialMinutes) * 60;
    setTotalSeconds(newDuration);
    
    const state: StoredTimerState = {
      remainingSeconds: newDuration,
      isRunning: false,
      startTimestamp: null,
      startingSeconds: null,
      initialDuration: initialMinutes * 60
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const end = () => {
    // Calculate final elapsed time
    let minutesCompleted = 0;
    if (startTimestampRef.current && startingSecondsRef.current !== null) {
      const elapsedMs = Date.now() - startTimestampRef.current;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      const remaining = Math.max(0, startingSecondsRef.current - elapsedSeconds);
      minutesCompleted = Math.floor((initialMinutes * 60 - remaining) / 60);
    } else {
      minutesCompleted = Math.floor((initialMinutes * 60 - totalSeconds) / 60);
    }
    
    setIsRunning(false);
    startTimestampRef.current = null;
    startingSecondsRef.current = null;
    
    // Clear the saved state
    localStorage.removeItem(storageKey);
    
    return minutesCompleted;
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
