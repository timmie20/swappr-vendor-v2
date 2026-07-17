"use client";
import React, { useEffect, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";

import { VendorSession } from "@/types/auth";
import UserSummary from "../user-summary";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { Skeleton } from "@/components/ui/skeleton";
import { getTimeGreeting } from "@/helpers/greeting";

type HeaderProps = {
  user: VendorSession;
};

export default function Header({ user }: HeaderProps) {
  // null until mounted — the server can't know the vendor's local time,
  // so the greeting only renders on the client
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(getTimeGreeting(new Date()));
  }, []);

  return (
    <header className="bg-background sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between border-b px-6">
      {" "}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          {greeting ? (
            <h1 className="text-2xl font-semibold tracking-tight">
              {greeting}
              {user.businessName ? `, ${user.businessName}` : ""}
            </h1>
          ) : (
            <Skeleton className="h-8 w-56" />
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell />

        <UserSummary user={user} />
      </div>
    </header>
  );
}
