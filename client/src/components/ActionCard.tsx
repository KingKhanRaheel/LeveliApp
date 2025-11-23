import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
}

export default function ActionCard({ icon: Icon, label, description, onClick }: ActionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      data-testid={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="group relative w-full min-h-[140px] rounded-3xl overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative h-full bg-card/80 backdrop-blur-sm border-2 border-card-border group-hover:border-primary/20 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-pink-500/30 transition-all">
            <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="font-display font-semibold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {label}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute right-6 top-1/2 -translate-y-1/2" />
      </div>
    </motion.button>
  );
}
