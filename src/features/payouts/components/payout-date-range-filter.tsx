"use client";

import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

interface PayoutDateRangeFilterProps {
  from?: string; // yyyy-MM-dd
  to?: string; // yyyy-MM-dd
  onChange: (from: string | undefined, to: string | undefined) => void;
}

export function PayoutDateRangeFilter({
  from,
  to,
  onChange,
}: PayoutDateRangeFilterProps) {
  const range: DateRange | undefined = from
    ? { from: new Date(from), to: to ? new Date(to) : undefined }
    : undefined;

  const label =
    from && to
      ? `${format(new Date(from), "dd MMM")} – ${format(new Date(to), "dd MMM yyyy")}`
      : from
        ? `From ${format(new Date(from), "dd MMM yyyy")}`
        : "Date range";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            !from && "text-muted-foreground",
          )}
        >
          <Icons.calendar className="size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={(next) =>
            onChange(
              next?.from ? format(next.from, "yyyy-MM-dd") : undefined,
              next?.to ? format(next.to, "yyyy-MM-dd") : undefined,
            )
          }
          numberOfMonths={2}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
