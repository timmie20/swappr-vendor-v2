import React from "react";
import { Icons } from "./shared/icons";
import Link from "next/link";
import { VendorSession } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type UserSummaryProps = {
  user: VendorSession;
};

export default function UserSummary({ user }: UserSummaryProps) {
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
                  <span className="inline-flex gap-1 items-center">
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
            <Link
              href="/edit-profile"
              className="w-full cursor-pointer! justify-start py-3.5 pr-8 pl-3 tracking-wide"
            >
              <Icons.settings className="mr-3 size-5" /> Edit Profile
            </Link>
          </DropdownMenuItem>

          <form action="/api/auth/logout" method="post">
            <DropdownMenuItem asChild>
              <button
                type="submit"
                className="w-full cursor-pointer! justify-start py-3.5 pr-8 pl-3 tracking-wide"
              >
                <Icons.logout className="mr-3 size-5" /> Log Out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
