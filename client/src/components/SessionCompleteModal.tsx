import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SessionCompleteModalProps {
  open: boolean;
  onClose: () => void;
  xpGained: number;
  message: string;
  leveledUp?: boolean;
  newLevel?: number;
}

export default function SessionCompleteModal({
  open,
  onClose,
  xpGained,
  message,
  leveledUp,
  newLevel
}: SessionCompleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-session-complete">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-display">
            {leveledUp ? '🎉 Level Up!' : '✨ Session Complete'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Session completion summary with XP gained and level progress
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-center text-lg text-muted-foreground font-medium">
            {message}
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-5xl font-display font-bold text-primary">
              +{xpGained}
            </span>
            <span className="text-2xl font-medium text-muted-foreground">XP</span>
          </div>

          {leveledUp && newLevel && (
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">You reached</p>
              <p className="text-3xl font-display font-bold text-primary">
                Level {newLevel}
              </p>
            </div>
          )}

          <Button
            onClick={onClose}
            className="w-full"
            size="lg"
            data-testid="button-continue"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
