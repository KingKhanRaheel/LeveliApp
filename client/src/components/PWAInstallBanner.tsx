import { useState } from "react";
import { X, Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PWAInstallBanner() {
  const { canInstall, promptInstall, shouldShowPrompt, dismissPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(true);

  if (!canInstall || !shouldShowPrompt || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    dismissPrompt();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        data-testid="pwa-install-banner"
      >
        <div className="bg-card border rounded-md shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold mb-1">Install Leveli</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Get quick access and work offline. Install our app for the best experience.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="flex-1"
                  data-testid="button-install-pwa"
                >
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  data-testid="button-dismiss-pwa"
                >
                  Not now
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
              data-testid="button-close-pwa-banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
