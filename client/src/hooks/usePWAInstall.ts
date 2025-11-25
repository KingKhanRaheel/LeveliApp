import { useState, useEffect } from 'react';

interface PWAInstallState {
  canInstall: boolean;
  promptInstall: () => Promise<boolean>;
  isInstalled: boolean;
  shouldShowPrompt: boolean;
  dismissPrompt: () => void;
}

const INSTALL_PROMPT_KEY = 'pwa_install_prompt_dismissed';
const SESSIONS_COUNT_KEY = 'pwa_sessions_completed';
const TOTAL_TIME_KEY = 'pwa_total_time_minutes';
const DISMISS_TIMESTAMP_KEY = 'pwa_dismiss_timestamp';

const MIN_SESSIONS = 3;
const MIN_MINUTES = 10;
const DISMISS_SESSIONS_COOLDOWN = 5;
const DISMISS_DAYS_COOLDOWN = 3;

export function usePWAInstall(): PWAInstallState {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    setIsInstalled(isStandalone);

    if (isStandalone) {
      return;
    }

    const handleInstallable = () => {
      setCanInstall(true);
      checkIfShouldShowPrompt();
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShouldShowPrompt(false);
    };
    
    const handleSessionTracked = () => {
      checkIfShouldShowPrompt();
    };

    if (window.deferredPrompt) {
      handleInstallable();
    }

    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);
    window.addEventListener('pwa-session-tracked', handleSessionTracked);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
      window.removeEventListener('pwa-session-tracked', handleSessionTracked);
    };
  }, []);

  const checkIfShouldShowPrompt = () => {
    const dismissTimestamp = localStorage.getItem(DISMISS_TIMESTAMP_KEY);
    const sessionsCount = parseInt(localStorage.getItem(SESSIONS_COUNT_KEY) || '0');
    const totalMinutes = parseInt(localStorage.getItem(TOTAL_TIME_KEY) || '0');

    if (dismissTimestamp) {
      const dismissedAt = parseInt(dismissTimestamp);
      const daysSinceDismiss = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
      
      const sessionsSinceDismiss = sessionsCount - parseInt(localStorage.getItem(INSTALL_PROMPT_KEY) || '0');
      
      if (daysSinceDismiss < DISMISS_DAYS_COOLDOWN && sessionsSinceDismiss < DISMISS_SESSIONS_COOLDOWN) {
        return;
      }
    }

    const meetsRequirements = sessionsCount >= MIN_SESSIONS || totalMinutes >= MIN_MINUTES;
    setShouldShowPrompt(meetsRequirements);
  };

  const promptInstall = async (): Promise<boolean> => {
    if (!window.deferredPrompt) {
      return false;
    }

    const prompt = window.deferredPrompt;
    prompt.prompt();
    
    const result = await prompt.userChoice;
    
    if (result.outcome === 'accepted') {
      window.deferredPrompt = null;
      setCanInstall(false);
      setShouldShowPrompt(false);
      return true;
    }
    
    dismissPrompt();
    return false;
  };

  const dismissPrompt = () => {
    setShouldShowPrompt(false);
    const currentSessions = localStorage.getItem(SESSIONS_COUNT_KEY) || '0';
    localStorage.setItem(INSTALL_PROMPT_KEY, currentSessions);
    localStorage.setItem(DISMISS_TIMESTAMP_KEY, Date.now().toString());
  };

  return {
    canInstall,
    promptInstall,
    isInstalled,
    shouldShowPrompt,
    dismissPrompt
  };
}

export function trackSessionForPWA(minutes: number) {
  const currentSessions = parseInt(localStorage.getItem(SESSIONS_COUNT_KEY) || '0');
  const currentMinutes = parseInt(localStorage.getItem(TOTAL_TIME_KEY) || '0');
  
  localStorage.setItem(SESSIONS_COUNT_KEY, (currentSessions + 1).toString());
  localStorage.setItem(TOTAL_TIME_KEY, (currentMinutes + minutes).toString());
  
  window.dispatchEvent(new CustomEvent('pwa-session-tracked'));
}
