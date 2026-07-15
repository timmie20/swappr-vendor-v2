import { getInspectionState } from "@/features/inspection/lib";
import { getServerVendorProfile, requireSession } from "@/lib/auth/session";

import { KpiGrid } from "./components/kpi-grid";
import { OverviewBody } from "./components/overview-body";
import { OverviewHeader } from "./components/overview-header";

export default async function OverviewPage() {
  // Same request-cached /vendors/me fetch the dashboard layout already made —
  // store status costs no extra network call.
  const session = await requireSession();
  const profile = await getServerVendorProfile();

  const inspectionState = getInspectionState(profile);

  return (
    <div className="space-y-6">
      <OverviewHeader
        firstName={session.firstName || session.businessName}
        inspectionState={inspectionState}
      />

      <KpiGrid />

      <OverviewBody
        inspectionState={inspectionState}
        pickupEnabled={profile.pickup_enabled ?? false}
      />
    </div>
  );
}
