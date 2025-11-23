interface PomodoroIndicatorProps {
  totalCycles: number;
  currentCycle: number;
}

export default function PomodoroIndicator({ totalCycles, currentCycle }: PomodoroIndicatorProps) {
  return (
    <div className="flex items-center gap-2" data-testid="pomodoro-indicator">
      {Array.from({ length: totalCycles }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full transition-all ${
            index < currentCycle
              ? 'bg-primary scale-110'
              : index === currentCycle
              ? 'bg-primary/50 ring-2 ring-primary ring-offset-2 ring-offset-background'
              : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}
