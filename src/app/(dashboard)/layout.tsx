import React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";
import { requireSession } from "@/lib/auth/session";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await requireSession();

  return (
    <SidebarProvider defaultOpen={true}>
      <NuqsAdapter>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />

          <SidebarInset className="flex min-h-0 flex-1 flex-col">
            <Header user={session} />

            <main className="min-h-0 flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </NuqsAdapter>
    </SidebarProvider>
  );
}
