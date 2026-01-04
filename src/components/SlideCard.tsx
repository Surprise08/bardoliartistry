import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SlideCardProps {
  children: ReactNode;
  isActive: boolean;
  variant?: 'default' | 'crt';
  className?: string;
}

const SlideCard = ({ children, isActive, variant = 'default', className }: SlideCardProps) => {
  const [showContent, setShowContent] = useState(false);
  const [showBuffering, setShowBuffering] = useState(true);

  useEffect(() => {
    if (isActive && variant === 'crt') {
      setShowBuffering(true);
      setShowContent(false);
      
      // Simulate TV turning on with buffering
      const bufferTimer = setTimeout(() => {
        setShowBuffering(false);
        setShowContent(true);
      }, 2000);
      
      return () => clearTimeout(bufferTimer);
    } else if (isActive) {
      setShowContent(true);
      setShowBuffering(false);
    }
  }, [isActive, variant]);

  if (!isActive) return null;

  const baseStyles = cn(
    "relative w-full max-w-lg mx-auto p-6 sm:p-8 lg:p-10",
    "rounded-xl animate-slide-up",
    "transition-all duration-500 ease-out"
  );

  if (variant === 'crt') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div
          className={cn(
            "relative w-[95vw] h-[85vh] max-w-6xl",
            "bg-black rounded-lg overflow-hidden",
            "border-2 border-muted/50",
            "crt-screen",
            className
          )}
        >
          {/* CRT Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.8) 100%)',
              borderRadius: '8px',
            }}
          />
          
          {/* Scanlines overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 crt-scanlines" />
          
          {/* Moving scanline */}
          <div 
            className="absolute left-0 right-0 h-8 pointer-events-none z-10 crt-moving-scanline"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03), transparent)',
            }}
          />
          
          {/* Screen content area */}
          <div className="relative z-0 w-full h-full flex items-center justify-center p-8 sm:p-12">
            {showBuffering ? (
              <div className="text-center space-y-6">
                {/* Static noise effect */}
                <div 
                  className="w-16 h-16 mx-auto rounded-full border-2 border-muted-foreground/50 flex items-center justify-center"
                  style={{ animation: 'pulse 1s ease-in-out infinite' }}
                >
                  <div className="w-3 h-3 bg-muted-foreground rounded-full animate-pulse" />
                </div>
                <p className="font-mono text-muted-foreground text-sm tracking-widest uppercase">
                  Tuning signal...
                </p>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-1 h-4 bg-muted-foreground/50"
                      style={{ 
                        animation: `pulse 0.8s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className={cn("w-full max-w-3xl", showContent ? "animate-fade-in" : "opacity-0")}>
                {children}
              </div>
            )}
          </div>

          {/* Screen glare */}
          <div 
            className="absolute inset-0 pointer-events-none z-30 opacity-5"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseStyles,
        "glass-strong",
        "border-border/30",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SlideCard;
