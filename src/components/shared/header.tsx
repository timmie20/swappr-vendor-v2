"use client";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

import { VendorSession } from "@/types/auth";
import UserSummary from "../user-summary";
import { NotificationBell } from "@/features/notifications/components/notification-bell";

type HeaderProps = {
  user: VendorSession;
};

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-50 flex h-22 shrink-0 items-center justify-between border-b px-6">
      {" "}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{user.businessName ? `, ${user.businessName}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm">
            Here’s what’s happening with your store today.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationBell />

        <UserSummary user={user} />
      </div>
    </header>
  );
}
