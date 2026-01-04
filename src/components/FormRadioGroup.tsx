import { cn } from '@/lib/utils';

interface FormRadioGroupProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const FormRadioGroup = ({ label, options, value, onChange, error }: FormRadioGroupProps) => {
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-foreground/80 font-body">
          {label}
        </label>
      )}
      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl cursor-pointer text-left w-full",
              "bg-secondary/30 border border-border/30",
              "hover:bg-secondary/50 hover:border-primary/30",
              "transition-all duration-300",
              value === option.value && "bg-primary/15 border-primary/50 glow-star"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                "transition-all duration-300",
                value === option.value
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/50"
              )}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>
            <span className="font-body text-foreground/90">{option.label}</span>
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
