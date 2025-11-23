import TimerControls from '../TimerControls';
import { useState } from 'react';

export default function TimerControlsExample() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="p-8 flex items-center justify-center">
      <TimerControls 
        isRunning={isRunning}
        onPlayPause={() => setIsRunning(!isRunning)}
        onEnd={() => console.log('End session')}
      />
    </div>
  );
}
