"use client";
import React from "react";
import { Icons } from "./shared/icons";
import { VendorSession } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/hooks/services/use-auth";
import { Button } from "./ui/button";

type UserSummaryProps = {
  user: VendorSession;
};

export default function UserSummary({ user }: UserSummaryProps) {
  const { mutate: logOut } = useLogout();
  return (
    <div className="ml-2 flex">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="ring-offset-background focus:ring-ring rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none">
          <Avatar>
            <AvatarImage
              src={user?.logoUrl || "/no-profile-picture.jpg"}
              alt={user?.businessName ?? "User avatar"}
              className="object-cover object-center"
            />
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          alignOffset={-10}
          className="flex flex-col"
          align="end"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {user?.businessName || "Unknown Vendor"}
              </p>
              <p>
                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1">
                    Verified{" "}
                    <Icons.shieldCheck className="text-primary ml-1 inline-block size-4" />{" "}
                  </span>
                )}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start gap-2"
              variant="ghost"
              onClick={() => logOut()}
            >
              <Icons.logout size={18} />
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
