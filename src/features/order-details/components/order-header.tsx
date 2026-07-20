"use client";

import { Printer, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/format";
import { OrderDetails, PaymentStatus } from "@/features/orders/types";

import { OrderStatusBadge, PaymentStatusBadge } from "./order-badges";
import { CopyButton } from "./copy-button";

interface OrderHeaderProps {
  order: OrderDetails;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function OrderHeader({
  order,
  onRefresh,
  isRefreshing,
}: OrderHeaderProps) {
  const placed = formatDate(order.created_at);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900">
            Order{" "}
            <span className="text-muted-foreground font-mono">
              #{order.order_number}
            </span>
          </h1>
          <CopyButton value={order.order_number} label="Order number" />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
          {placed && (
            <span className="text-muted-foreground text-xs">
              Placed {placed.relative}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {order.payment_status === PaymentStatus.PAID && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-9 gap-2 text-gray-600"
          >
            <Printer className="size-4" />
            <span className="hidden sm:inline">Print Receipt</span>
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 w-9 p-0 text-gray-400"
          title="Refresh"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
}
