"use client";
import React, { useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
import { Bell } from "lucide-react";
import { VendorSession } from "@/types/auth";
import UserSummary from "../user-summary";
import { Icons } from "./icons";

type HeaderProps = {
  user: VendorSession;
};

export default function Header({ user }: HeaderProps) {
  // const [selectedPeriod, setSelectedPeriod] = useState("7d");

  return (
    <header className="flex h-22 items-center justify-between border-b px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.businessName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here’s what’s happening with your store today.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon-lg" className="cursor-pointer">
          <Icons.bell className="w-4 h-4" />
        </Button>

        <UserSummary user={user} />
      </div>
      {/* <div className="flex items-center space-x-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Today</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4" />
        </Button>
      </div> */}
    </header>
  );
}
