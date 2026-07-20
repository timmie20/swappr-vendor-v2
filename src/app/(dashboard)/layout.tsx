import React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";
import { getServerVendorProfile, requireSession } from "@/lib/auth/session";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cookies } from "next/headers";
import { requireOnboardingComplete } from "@/lib/onboarding/server";
import { OnboardingFlagSync } from "@/components/shared/onboarding-flag-sync";
import { getInspectionState } from "@/features/inspection/lib";
import { InspectionBanner } from "@/features/inspection/components/inspection-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await requireSession();

  await requireOnboardingComplete();

  // Same request-cached /vendors/me fetch requireSession used — no extra call
  const profile = await getServerVendorProfile();
  const showInspectionBanner = getInspectionState(profile) === "not_requested";

  return (
    <SidebarProvider defaultOpen={true}>
      <NuqsAdapter>
        <div className="flex h-screen w-full overflow-hidden">
          {/* Sidebar, header and the inspection banner are app chrome —
              printing a page (e.g. the order receipt) should only ever
              produce the page's own printable content, never the nav. */}
          <div className="print:hidden">
            <AppSidebar user={session} />
          </div>

          <SidebarInset className="flex min-h-0 flex-1 flex-col">
            <div className="print:hidden">
              <Header user={session} />

              {showInspectionBanner && (
                <InspectionBanner vendorId={session.id} />
              )}
            </div>

            <main className="min-h-0 flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0">
              {children}
            </main>
          </SidebarInset>
        </div>

        {/* requireOnboardingComplete passed, so onboarding is done */}
        <OnboardingFlagSync complete={true} />
      </NuqsAdapter>
    </SidebarProvider>
  );
}
