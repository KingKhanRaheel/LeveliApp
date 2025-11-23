import StatCard from '../StatCard';
import { Clock, Flame, Trophy } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 max-w-2xl">
      <StatCard icon={Clock} label="Total Time" value="12h" />
      <StatCard icon={Flame} label="Streak" value="7" gradient />
      <StatCard icon={Trophy} label="Level" value="5" />
    </div>
  );
}
