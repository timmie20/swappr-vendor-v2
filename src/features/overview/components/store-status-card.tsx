import Link from "next/link";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InspectionState } from "@/features/inspection/lib";

const INSPECTION_ROW_MAP: Record<
  InspectionState,
  { label: string; variant: BadgeProps["variant"] }
> = {
  verified: { label: "Verified", variant: "paid" },
  pending: { label: "Pending", variant: "unpaid" },
  not_requested: { label: "Not requested", variant: "secondary" },
};

// The dashboard layout gates on requireOnboardingComplete, so onboarding is
// always complete by the time this renders — the row is a static reassurance,
// not a live state.
export function StoreStatusCard({
  inspectionState,
  pickupEnabled,
}: {
  inspectionState: InspectionState;
  pickupEnabled: boolean;
}) {
  const inspection = INSPECTION_ROW_MAP[inspectionState];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Store status</CardTitle>
        <Link
          href="/account"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          Manage
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        <StatusRow label="Onboarding">
          <Badge variant="paid">Complete</Badge>
        </StatusRow>

        <StatusRow label="Store inspection">
          <Badge variant={inspection.variant}>{inspection.label}</Badge>
        </StatusRow>

        <StatusRow label="Pickup at store">
          <Badge variant={pickupEnabled ? "paid" : "secondary"}>
            {pickupEnabled ? "Enabled" : "Off"}
          </Badge>
        </StatusRow>
      </CardContent>
    </Card>
  );
}

function StatusRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      {children}
    </div>
  );
}
