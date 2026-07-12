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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../ui/sidebar";
import { NAV_ITEMS } from "@/constants/nav-items";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import { Icons } from "./icons";
import Item from "./nav-item";
import { useLogout } from "@/hooks/services/use-auth";
import { ASSETS } from "@/constants/assets";
import { VendorSession } from "@/types/auth";

type AppSidebarProps = {
  user: VendorSession;
};

export default function AppSidebar({ user }: AppSidebarProps) {
  const { mutate: logOut, isPending } = useLogout();

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.businessName;
  const initials =
    fullName
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "V";

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
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage
                      src={
                        user.avatarUrl || user.logoUrl || "/no-profile-picture.jpg"
                      }
                      alt={fullName}
                      className="object-cover object-center"
                    />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{fullName}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {fullName}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user.businessName}
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {user.email}
                    </p>
                    {user.isVerified && (
                      <p className="flex items-center gap-1 text-xs">
                        Verified
                        <Icons.shieldCheck className="text-primary size-3.5" />
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account">
                    <Icons.settings size={18} className="mr-1" />
                    Account
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  disabled={isPending}
                  onClick={() => logOut()}
                  className="cursor-pointer"
                >
                  <Icons.logout size={18} className="mr-1" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
