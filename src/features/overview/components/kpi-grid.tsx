"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/helpers/format";
import { useVendorOverviewSummary } from "@/hooks/services/use-overview";
import { SectionRetry } from "./section-retry";

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
            <CardContent className="space-y-2 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const tiles = [
    { label: "Needs your action", value: data.needs_action_count },
    { label: "Orders this month", value: data.this_month_count },
    {
      label: "Revenue this month",
      value: formatCurrency(data.revenue_this_month),
    },
    {
      label: "Active listings",
      value: data.active_count,
      // "0 out of stock" is noise — only surface the flag when it bites
      hint:
        data.out_of_stock_count > 0
          ? `${data.out_of_stock_count} out of stock`
          : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
      {tiles.map((tile) => (
        <Card key={tile.label}>
          <CardContent className="space-y-1 p-4">
            <p className="text-muted-foreground text-sm">{tile.label}</p>
            <p className="text-2xl font-semibold tracking-tight">
              {tile.value}
            </p>
            {tile.hint && (
              <p className="text-destructive text-xs">{tile.hint}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
