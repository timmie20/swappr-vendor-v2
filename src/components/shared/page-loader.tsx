import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** Full-viewport overlay spinner for route transitions */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner className="text-primary size-8" />
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    </div>
  );
}
