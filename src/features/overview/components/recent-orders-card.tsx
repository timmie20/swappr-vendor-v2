"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_BADGE_MAP } from "@/constants/badge";
import { formatCurrency, formatDate } from "@/helpers/format";
import { useRecentOrders } from "@/hooks/services/use-overview";
import type { Order } from "@/features/orders/types";
import { SectionRetry } from "./section-retry";

export function RecentOrdersCard({ height }: { height?: number }) {
  const { data, isLoading, isError, refetch } = useRecentOrders();

  const orders = data?.orders ?? [];

  return (
    // `height` is the sibling column's measured height (see OverviewBody) —
    // min-h-96 only covers the first paint before that measurement lands.
    <Card
      className="flex min-h-96 flex-col"
      style={height ? { height } : undefined}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Recent orders</CardTitle>
        <Link
          href="/orders"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          View all orders
        </Link>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 px-2 pb-2">
        {isLoading ? (
          <RecentOrdersSkeleton />
        ) : isError ? (
          <SectionRetry
            message="Couldn’t load recent orders."
            onRetry={() => refetch()}
          />
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-sm">
            No orders yet — new orders will show up here.
          </p>
        ) : (
          <ScrollArea className="h-full">
            <div className="divide-y pr-2">
              {orders.map((order) => (
                <RecentOrderRow key={order.id} order={order} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function RecentOrderRow({ order }: { order: Order }) {
  const { label, variant } = STATUS_BADGE_MAP[order.status];
  const placed = formatDate(order.created_at);

  return (
    <Link
      href={`/orders/${order.order_number}`}
      className="hover:bg-accent flex items-center gap-3 rounded-md px-4 py-3 transition-colors"
    >
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate font-mono text-sm font-medium">
          {order.order_number}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {order.buyer.first_name} {order.buyer.last_name}
          {placed && <> · {placed.relative}</>}
        </p>
      </div>

      <Badge variant={variant}>{label}</Badge>

      <span className="w-24 text-right text-sm font-medium">
        {formatCurrency(order.total_amount)}
      </span>
    </Link>
  );
}

function RecentOrdersSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
