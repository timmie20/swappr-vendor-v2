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
  SidebarFooter,
} from "../ui/sidebar";
import { NAV_ITEMS } from "@/constants/nav-items";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icons } from "./icons";
import Item from "./nav-item";
import { useLogout } from "@/hooks/use-auth";
import { ASSETS } from "@/constants/assets";

export default function AppSidebar() {
  const { mutate: logOut } = useLogout();
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <Image
            src={ASSETS.LOGO_DARK}
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
                <Item key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <form action={() => logOut()} className="w-full">
          <Button
            type="submit"
            className="w-full cursor-pointer justify-start gap-2"
          >
            <Icons.logout size={18} />
            Log out
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
