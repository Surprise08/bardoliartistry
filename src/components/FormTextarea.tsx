import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-foreground/80 font-body">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-xl min-h-[120px] resize-none",
            "bg-secondary/50 border border-border/50",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "transition-all duration-300",
            "font-body text-base",
            error && "border-destructive/50 focus:ring-destructive/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive font-body">{error}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
