import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressIndicator = ({ currentStep, totalSteps, className }: ProgressIndicatorProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className={cn("w-full max-w-md mx-auto mb-8", className)}>
      <div className="flex justify-between text-xs text-muted-foreground mb-2 font-body">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-dark via-primary to-gold-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
