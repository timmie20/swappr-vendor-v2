import { getInspectionState } from "@/features/inspection/lib";
import { getServerVendorProfile, requireSession } from "@/lib/auth/session";

import { ActivityFeedCard } from "./components/activity-feed-card";
import { KpiGrid } from "./components/kpi-grid";
import { OverviewHeader } from "./components/overview-header";
import { RecentOrdersCard } from "./components/recent-orders-card";
import { StoreStatusCard } from "./components/store-status-card";

export default async function OverviewPage() {
  // Same request-cached /vendors/me fetch the dashboard layout already made —
  // store status costs no extra network call.
  const session = await requireSession();
  const profile = await getServerVendorProfile();

  const inspectionState = getInspectionState(profile);

  return (
    <div className="space-y-6">
      <OverviewHeader
        name={session.firstName || session.businessName}
        inspectionState={inspectionState}
      />

      <KpiGrid />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersCard />
        </div>

        <div className="space-y-6">
          <StoreStatusCard
            inspectionState={inspectionState}
            pickupEnabled={profile.pickup_enabled ?? false}
          />
          <ActivityFeedCard />
        </div>
      </div>
    </div>
  );
}
