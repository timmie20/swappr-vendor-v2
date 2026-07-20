import { Switch } from "@/components/ui/switch";

interface DataTableToggleProps {
  checked: boolean;
  isPending?: boolean;
  onToggle: () => void;
  ariaLabel?: string;
}

export function DataTableSwitch({
  checked,
  isPending = false,
  onToggle,
  ariaLabel,
}: DataTableToggleProps) {
  return (
    <Switch
      checked={checked}
      disabled={isPending}
      onCheckedChange={onToggle}
      aria-label={ariaLabel}
    />
  );
}
