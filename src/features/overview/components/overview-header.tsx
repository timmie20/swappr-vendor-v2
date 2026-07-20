"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/shared/icons";
import { Skeleton } from "@/components/ui/skeleton";
import type { InspectionState } from "@/features/inspection/lib";

export function OverviewHeader({
  firstName,
  inspectionState,
}: {
  firstName: string;
  inspectionState: InspectionState;
}) {
  // null until mounted — the server can't know the vendor's local time,
  // so the greeting and clock only render on the client
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="from-primary/10 via-primary/5 flex flex-col gap-4 rounded-xl border bg-linear-to-r to-transparent p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back{firstName ? `, ${firstName}` : ""}
          </h2>

          {/* Only render a badge when something is actually in flight — the
              inspection banner already prompts the not-requested case, and a
              healthy store gets no pill at all. */}
          {inspectionState === "pending" && (
            <Badge variant="unpaid">Inspection pending</Badge>
          )}
        </div>

        <p className="text-muted-foreground text-sm">
          Here’s what’s happening with your store today.
        </p>
      </div>

      <div className="space-y-1.5 text-left sm:text-right">
        {now ? (
          <>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm sm:justify-end">
              <Icons.calendar className="size-4" />
              {format(now, "EEEE, d MMMM yyyy")}
            </p>
            <p className="flex items-center gap-1.5 text-sm font-medium tabular-nums sm:justify-end">
              <Icons.clock className="text-muted-foreground size-4" />
              {format(now, "h:mm:ss a")}
            </p>
          </>
        ) : (
          <>
            <Skeleton className="h-4 w-44 sm:ml-auto" />
            <Skeleton className="h-4 w-28 sm:ml-auto" />
          </>
        )}
      </div>
    </div>
  );
}
