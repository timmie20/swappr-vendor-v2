"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { NavItem } from "@/constants/nav-items";

type NavItemType = {
  item: NavItem;
};

export default function Item({ item }: NavItemType) {
  const path = usePathname();

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={path === item.url}>
        <a href={item.url} className="flex items-center space-x-2">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
