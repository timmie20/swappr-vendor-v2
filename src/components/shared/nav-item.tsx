"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { NavItem } from "@/constants/nav-items";

type NavItemType = {
  item: NavItem;
};

export default function Item({ item }: NavItemType) {
  const path = usePathname();

  // Keep the item active on nested routes too (e.g. /orders/1234)
  const isActive = path === item.url || path.startsWith(`${item.url}/`);

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground"
      >
        <Link href={item.url} className="flex items-center space-x-2">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
