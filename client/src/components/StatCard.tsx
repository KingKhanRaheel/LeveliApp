import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  gradient?: boolean;
}

export default function StatCard({ icon: Icon, label, value, gradient }: StatCardProps) {
  return (
    <Card className={gradient ? "bg-gradient-to-br from-card to-card/50" : ""}>
      <CardContent className="p-6 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="text-3xl font-display font-bold" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
      </CardContent>
    </Card>
  );
}
