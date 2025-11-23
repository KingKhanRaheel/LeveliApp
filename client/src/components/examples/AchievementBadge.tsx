import AchievementBadge from '../AchievementBadge';
import { Zap, Target, Award } from 'lucide-react';

export default function AchievementBadgeExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-8 max-w-md">
      <AchievementBadge 
        icon={Zap}
        name="First Session"
        locked={false}
        onClick={() => console.log('Achievement clicked')}
      />
      <AchievementBadge 
        icon={Target}
        name="100 Minutes"
        locked={false}
        progress={65}
        onClick={() => console.log('Achievement clicked')}
      />
      <AchievementBadge 
        icon={Award}
        name="Marathon"
        locked={true}
        onClick={() => console.log('Achievement clicked')}
      />
    </div>
  );
}
