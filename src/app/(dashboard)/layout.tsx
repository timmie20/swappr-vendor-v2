import React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";
import { requireSession } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await requireSession();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar session={session} />
        <SidebarInset className="flex-1">
          <Header user={session} />
          <main className="flex-1 p-6 space-y-6 print:py-0!">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
