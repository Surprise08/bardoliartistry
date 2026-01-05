import { cn } from '@/lib/utils';

interface SponsorBadgeProps {
  show: boolean;
}

const SponsorBadge = ({ show }: SponsorBadgeProps) => {
  if (!show) return null;
  
  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "px-4 py-2 rounded-lg",
        "bg-secondary/60 backdrop-blur-sm border border-border/30",
        "animate-fade-in"
      )}
    >
      <p className="text-xs text-muted-foreground font-body tracking-wide">
        Sponsored by <span className="text-foreground/90 font-medium">Bardoli Artistry</span>
      </p>
    </div>
  );
};

export default SponsorBadge;
