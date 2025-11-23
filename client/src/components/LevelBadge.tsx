interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export default function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-20 h-20 text-3xl",
    lg: "w-32 h-32 text-5xl"
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 blur-md opacity-60`} />
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-primary/30 flex items-center justify-center font-display font-bold text-primary-foreground shadow-lg`}>
        {level}
      </div>
    </div>
  );
}
