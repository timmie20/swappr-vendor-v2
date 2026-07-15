import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import type { InspectionState } from "@/features/inspection/lib";

export function OverviewHeader({
  name,
  inspectionState,
}: {
  name: string;
  inspectionState: InspectionState;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Typography variant="h2" className="text-left">
          Welcome back{name ? `, ${name}` : ""}
        </Typography>
        <p className="text-muted-foreground text-sm">
          Here’s how your store is doing.
        </p>
      </div>

      {/* Only render a badge when something is actually in flight — the
          inspection banner already prompts the not-requested case, and a
          healthy store gets no pill at all. */}
      {inspectionState === "pending" && (
        <Badge variant="unpaid">Inspection pending</Badge>
      )}
    </div>
  );
}
