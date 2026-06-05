"use client";
import React, { useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Bell, Download, Filter } from "lucide-react";

export default function Header() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  return (
    <header className="flex h-20 items-center justify-between border-b px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold">New Things Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, here’s what’s happening with your store today.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
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
      </div>
    </header>
  );
}
