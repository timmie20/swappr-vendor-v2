"use client";
import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "../ui/sidebar";
import { NAV_ITEMS } from "@/constants/nav-items";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Icons } from "./icons";

export default function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <Image
            src="/assets/swappr-logo-dark.png"
            alt="Swappr"
            width={120}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={path === item.url}>
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Link
          href="/profile"
          className="hover:bg-muted focus-visible:ring-ring mb-4 flex items-center gap-3 rounded-lg p-2 transition-colors focus-visible:ring-1 focus-visible:outline-none"
          // onClick={isMobile ? () => setOpenMobile(false) : undefined}
        >
          <div className="bg-muted flex size-10 items-center justify-center rounded-full">
            <Icons.user size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {vendor?.business_name}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {vendor?.email}
            </p>
          </div>

          <Icons.chevronRight
            size={16}
            className="text-muted-foreground shrink-0"
          />
        </Link>

        <form action="/auth/sign-out" method="post">
          <Button type="submit" className="w-full justify-start gap-2">
            <Icons.logout size={18} />
            Log out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
