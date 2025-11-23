import LevelBadge from '../LevelBadge';

export default function LevelBadgeExample() {
  return (
    <div className="flex items-center gap-8 p-8">
      <LevelBadge level={5} size="sm" />
      <LevelBadge level={12} size="md" />
      <LevelBadge level={25} size="lg" />
    </div>
  );
}
