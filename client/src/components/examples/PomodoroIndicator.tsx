import PomodoroIndicator from '../PomodoroIndicator';

export default function PomodoroIndicatorExample() {
  return (
    <div className="p-8 flex items-center justify-center">
      <PomodoroIndicator totalCycles={4} currentCycle={1} />
    </div>
  );
}
