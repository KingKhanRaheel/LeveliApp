interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

export default function TimerDisplay({ minutes, seconds }: TimerDisplayProps) {
  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center justify-center gap-2" data-testid="timer-display">
      <span className="font-display font-bold text-8xl md:text-9xl tabular-nums tracking-tight">
        {formatTime(minutes)}
      </span>
      <span className="font-display font-bold text-8xl md:text-9xl text-primary animate-pulse">
        :
      </span>
      <span className="font-display font-bold text-8xl md:text-9xl tabular-nums tracking-tight">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
