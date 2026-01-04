import { RotateCcw } from 'lucide-react';

const RotationPrompt = () => {
  return (
    <div className="rotate-prompt fixed inset-0 z-[9999] bg-background flex-col items-center justify-center gap-6 p-8 text-center hidden">
      <RotateCcw className="w-16 h-16 text-muted-foreground animate-pulse" />
      <div className="space-y-2">
        <h2 className="text-xl font-display text-foreground uppercase tracking-widest">
          Rotate Your Device
        </h2>
        <p className="text-sm text-muted-foreground font-body max-w-xs">
          Please rotate your device to landscape mode for the best experience.
        </p>
      </div>
    </div>
  );
};

export default RotationPrompt;
