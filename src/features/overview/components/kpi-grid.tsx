"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons, type Icon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/format";
import { useVendorOverviewSummary } from "@/hooks/services/use-overview";
import { SectionRetry } from "./section-retry";

// Accent tints reuse hues already in the app's badge system — amber for
// attention (unpaid), primary blue, green for money (paid), violet
// (shipped). Values themselves stay in foreground ink; only the icon chip
// and the surface gradient carry the accent.
const TILE_ACCENTS = {
  amber: {
    gradient: "from-amber-600/10",
    chip: "bg-amber-600/15 text-amber-600",
  },
  primary: {
    gradient: "from-primary/10",
    chip: "bg-primary/15 text-primary",
  },
  green: {
    gradient: "from-green-700/10",
    chip: "bg-green-700/15 text-green-700 dark:text-green-500",
  },
  violet: {
    gradient: "from-violet-600/10",
    chip: "bg-violet-600/15 text-violet-600 dark:text-violet-400",
  },
} satisfies Record<string, { gradient: string; chip: string }>;

type TileAccent = keyof typeof TILE_ACCENTS;

export function KpiGrid() {
  const { data, isError, refetch } = useVendorOverviewSummary();

  if (isError) {
    return (
      <Card>
        <SectionRetry
          message="Couldn’t load your store summary."
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-1/2" />
              </div>
              <Skeleton className="size-10 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const tiles: {
    label: string;
    value: string | number;
    icon: Icon;
    accent: TileAccent;
    hint?: string;
  }[] = [
    {
      label: "Orders needing attention",
      value: data.orders.needs_action_count,
      icon: Icons.warning,
      accent: "amber",
    },
    {
      label: "Orders this month",
      value: data.orders.this_month_count,
      icon: Icons.package,
      accent: "primary",
    },
    {
      label: "Revenue this month",
      value: formatCurrency(data.orders.revenue_this_month),
      icon: Icons.billing,
      accent: "green",
    },
    {
      label: "Active listings",
      value: data.listings.active_count,
      icon: Icons.product,
      accent: "violet",
      // "0 out of stock" is noise — only surface the flag when it bites
      hint:
        data.listings.out_of_stock_count > 0
          ? `${data.listings.out_of_stock_count} out of stock`
          : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
      {tiles.map((tile) => {
        const accent = TILE_ACCENTS[tile.accent];
        return (
          <Card
            key={tile.label}
            className={cn(
              "bg-linear-to-br via-transparent to-transparent",
              accent.gradient,
            )}
          >
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div className="min-w-0 space-y-1">
                <p className="text-muted-foreground truncate text-sm">
                  {tile.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                  {tile.value}
                </p>
                {tile.hint && (
                  <p className="text-destructive text-xs">{tile.hint}</p>
                )}
              </div>

              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  accent.chip,
                )}
              >
                <tile.icon className="size-5" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
