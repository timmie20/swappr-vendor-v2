"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogout } from "@/hooks/services/use-auth";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const { mutate: logOut, isPending } = useLogout();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => logOut()}
      className={cn("gap-2", className)}
    >
      {isPending ? <Spinner /> : <LogOut className="size-4" />}
      Log out
    </Button>
  );
}
