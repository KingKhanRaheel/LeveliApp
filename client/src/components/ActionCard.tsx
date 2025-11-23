import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
}

export default function ActionCard({ icon: Icon, label, description, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      data-testid={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="w-full min-h-[140px] rounded-3xl bg-gradient-to-br from-card to-card/50 border border-card-border p-8 flex flex-col items-center justify-center gap-3 hover-elevate active-elevate-2 transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="font-display font-semibold text-xl">{label}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </button>
  );
}
