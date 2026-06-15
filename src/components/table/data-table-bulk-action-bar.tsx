import { Trash2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "../ui/spinner";

interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isPending?: boolean;
  variant?: "default" | "destructive" | "outline" | "ghost" | "secondary";
}

interface DataTableBulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClearSelection: () => void;
}

export function DataTableBulkActionBar({
  selectedCount,
  actions,
  onClearSelection,
}: DataTableBulkActionBarProps) {
  return (
    <div className="bg-background flex h-12 items-center gap-2 rounded-md border px-3 shadow-sm">
      {/* Selected count + clear */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          {selectedCount} selected
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={onClearSelection}
        >
          <X className="size-3.5" />
          <span className="sr-only">Clear selection</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant ?? "ghost"}
            size="sm"
            className="h-7 cursor-pointer gap-1.5 text-xs"
            onClick={action.onClick}
            disabled={action.isPending}
          >
            {action.isPending && <Spinner />}
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
