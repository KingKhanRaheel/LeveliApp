import TimerDisplay from '../TimerDisplay';

export default function TimerDisplayExample() {
  return (
    <div className="p-8 flex items-center justify-center min-h-[300px]">
      <TimerDisplay minutes={25} seconds={0} />
    </div>
  );
}
