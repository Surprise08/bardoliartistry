import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name?: string;
}

const FormRadioGroup = ({ options, value, onChange, error, name = 'radio-group' }: FormRadioGroupProps) => {
  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-lg",
              "border transition-all duration-300",
              "text-left font-body",
              value === option.value
                ? "bg-secondary/50 border-accent/50 text-foreground"
                : "bg-secondary/20 border-border/30 text-foreground/70 hover:bg-secondary/30 hover:border-border/50"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                value === option.value
                  ? "border-accent bg-accent"
                  : "border-muted-foreground/50"
              )}
            >
              {value === option.value && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground" />
              )}
            </div>
            <span className="text-sm">{option.label}</span>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-destructive font-body">{error}</p>
      )}
    </div>
  );
};

export default FormRadioGroup;
