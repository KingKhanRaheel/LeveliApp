import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getRandomMessage } from "@/lib/content";

interface StrictModePrematureExitModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  minutesFocused: number;
  xpAtRisk: number;
}

export default function StrictModePrematureExitModal({ 
  open, 
  onConfirm, 
  onCancel, 
  minutesFocused, 
  xpAtRisk 
}: StrictModePrematureExitModalProps) {
  const warnings = [
    "Ending early? That's no XP. You sure?",
    "You'll lose all XP if you quit now.",
    "Premature exit = zero reward. Think twice.",
    "Bail out? You get nothing. Worth it?",
    "Stop now and lose all progress. Still want to?"
  ];
  
  const message = getRandomMessage(warnings);
  
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Strict Mode: Ending Early?</AlertDialogTitle>
          <AlertDialogDescription className="text-base space-y-3">
            <p>{message}</p>
            <p className="text-sm text-destructive font-medium">
              You've focused for {minutesFocused} {minutesFocused === 1 ? "minute" : "minutes"} and earned {xpAtRisk} XP. Ending now means you lose it all.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Keep Going</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            End & Lose XP
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
