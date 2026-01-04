import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SlideCardProps {
  children: ReactNode;
  isActive: boolean;
  variant?: 'default' | 'crt';
  className?: string;
}

const SlideCard = ({ children, isActive, variant = 'default', className }: SlideCardProps) => {
  if (!isActive) return null;

  const baseStyles = cn(
    "relative w-full max-w-lg mx-auto p-6 sm:p-8 lg:p-10",
    "rounded-2xl animate-slide-up",
    "transition-all duration-500 ease-out"
  );

  if (variant === 'crt') {
    return (
      <div
        className={cn(
          baseStyles,
          "max-w-4xl bg-background/95 backdrop-blur-xl",
          "border border-primary/30 glow-gold",
          "overflow-hidden",
          className
        )}
      >
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, hsla(38, 92%, 50%, 0.03) 2px, hsla(38, 92%, 50%, 0.03) 4px)'
          }}
        />
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseStyles,
        "glass-strong",
        "border-primary/20 glow-gold-sm",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SlideCard;
