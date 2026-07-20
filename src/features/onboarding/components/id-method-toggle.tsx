import { cn } from "@/lib/utils";
import type { IdMethod } from "@/schemas/onboarding";

const ID_METHOD_OPTIONS: {
  value: IdMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "bvn",
    label: "Verify with BVN",
    description: "Bank Verification Number",
  },
  {
    value: "nin",
    label: "Verify with NIN",
    description: "National Identification Number",
  },
];

interface IdMethodToggleProps {
  value: IdMethod;
  onChange: (method: IdMethod) => void;
}

export function IdMethodToggle({ value, onChange }: IdMethodToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Verification method"
      className="grid grid-cols-2 gap-3"
    >
      {ID_METHOD_OPTIONS.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-20 cursor-pointer flex-col items-start justify-center gap-0.5 rounded-lg border px-4 text-left transition-colors",
              "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              selected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-foreground/20 hover:bg-muted/40",
            )}
          >
            <span className="text-foreground text-sm font-medium">
              {option.label}
            </span>
            <span className="text-muted-foreground text-xs">
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
