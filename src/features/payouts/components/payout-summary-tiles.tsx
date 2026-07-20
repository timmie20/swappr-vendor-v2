"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons, type Icon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/format";
import { usePayoutSummary } from "@/hooks/services/use-payouts";
import { SectionRetry } from "@/features/overview/components/section-retry";

const TILE_ACCENTS = {
  green: {
    gradient: "from-green-700/10",
    chip: "bg-green-700/15 text-green-700 dark:text-green-500",
  },
  amber: {
    gradient: "from-amber-600/10",
    chip: "bg-amber-600/15 text-amber-600",
  },
  destructive: {
    gradient: "from-destructive/10",
    chip: "bg-destructive/15 text-destructive",
  },
} satisfies Record<string, { gradient: string; chip: string }>;

type TileAccent = keyof typeof TILE_ACCENTS;

export function PayoutSummaryTiles() {
  const { data, isError, refetch } = usePayoutSummary();

  if (isError) {
    return (
      <Card>
        <SectionRetry
          message="Couldn't load your payout summary."
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
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

  const { total_paid_out, pending_balance, failed_amount } = data.summary;

  const tiles: {
    label: string;
    value: string;
    icon: Icon;
    accent: TileAccent;
    hint?: string;
  }[] = [
    {
      label: "Total paid out",
      value: formatCurrency(total_paid_out),
      icon: Icons.billing,
      accent: "green",
    },
    {
      label: "Pending balance",
      value: formatCurrency(pending_balance),
      icon: Icons.clock,
      accent: "amber",
      hint: "On its way to your bank account",
    },
  ];

  // Only surface the failed tile when there's actually something to act on
  if (failed_amount > 0) {
    tiles.push({
      label: "Failed payouts",
      value: formatCurrency(failed_amount),
      icon: Icons.warning,
      accent: "destructive",
      hint: "Contact support to resolve",
    });
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
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
                  <p
                    className={cn(
                      "text-xs",
                      tile.accent === "destructive"
                        ? "text-destructive"
                        : "text-muted-foreground",
                    )}
                  >
                    {tile.hint}
                  </p>
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
