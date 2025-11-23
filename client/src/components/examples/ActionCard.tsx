import ActionCard from '../ActionCard';
import { Timer, Clock } from 'lucide-react';

export default function ActionCardExample() {
  return (
    <div className="w-full max-w-md p-8 space-y-4">
      <ActionCard 
        icon={Timer}
        label="Focus Timer"
        description="Continuous focus session"
        onClick={() => console.log('Focus Timer clicked')}
      />
      <ActionCard 
        icon={Clock}
        label="Pomodoro"
        description="25 min focus, 5 min break"
        onClick={() => console.log('Pomodoro clicked')}
      />
    </div>
  );
}
