import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  submitLabel?: string;
}

const NavigationButtons = ({
  onPrev,
  onNext,
  onSubmit,
  showPrev = true,
  showNext = true,
  showSubmit = false,
  isLoading = false,
  nextLabel = "Continue",
  submitLabel = "Submit"
}: NavigationButtonsProps) => {
  const buttonBase = cn(
    "flex items-center gap-2 px-6 py-3 rounded-full",
    "font-body font-medium text-sm",
    "transition-all duration-300",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
      {showPrev && onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className={cn(
            buttonBase,
            "bg-secondary/50 text-foreground/80",
            "hover:bg-secondary hover:text-foreground"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      ) : (
        <div />
      )}

      {showSubmit && onSubmit ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className={cn(
            buttonBase,
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 glow-gold-sm hover:glow-gold"
          )}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          {submitLabel}
        </button>
      ) : showNext && onNext ? (
        <button
          type="button"
          onClick={onNext}
          className={cn(
            buttonBase,
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 glow-gold-sm hover:glow-gold"
          )}
        >
          {nextLabel}
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};

export default NavigationButtons;
