import React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 p-6 space-y-6 print:py-0!">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
