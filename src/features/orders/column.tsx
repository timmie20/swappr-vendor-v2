import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Order, OrderStatus, VENDOR_UPDATABLE_STATUSES } from "./types";

// Formatted for display — keeps rendering logic out of the column cell
function formatAmount(amount: string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

const STATUS_BADGE_MAP: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [OrderStatus.PENDING]: { label: "Pending", variant: "secondary" },
  [OrderStatus.CONFIRMED]: { label: "Confirmed", variant: "default" },
  [OrderStatus.PROCESSING]: { label: "Processing", variant: "default" },
  [OrderStatus.SHIPPED]: { label: "Shipped", variant: "default" },
  [OrderStatus.DELIVERED]: { label: "Delivered", variant: "default" },
  [OrderStatus.CANCELLED]: { label: "Cancelled", variant: "destructive" },
};

const PAYMENT_BADGE_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  paid: { label: "Paid", variant: "default" },
  unpaid: { label: "Unpaid", variant: "secondary" },
};

// Columns are a plain function — no hooks, no side effects.
// Actions are injected as callbacks so this file stays pure.
interface GetOrderColumnsOptions {
  onView: (order: Order) => void;
  onUpdateStatus: (order: Order) => void;
}

export function getOrderColumns({
  onView,
  onUpdateStatus,
}: GetOrderColumnsOptions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "order_number",
      header: "Order",

      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("order_number")}
        </span>
      ),
    },
    {
      id: "buyer",
      header: "Customer",
      cell: ({ row }) => {
        const buyer = row.original.buyer;
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {buyer.first_name} {buyer.last_name}
            </span>
            <span className="text-muted-foreground text-xs">{buyer.email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<OrderStatus>("status");
        const { label, variant } = STATUS_BADGE_MAP[status];
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue<string>("payment_status");
        const { label, variant } = PAYMENT_BADGE_MAP[status] ?? {
          label: status,
          variant: "outline" as const,
        };
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => formatAmount(row.getValue("total_amount")),
    },
    {
      accessorKey: "created_at",
      header: "Placed",
      cell: ({ row }) =>
        format(new Date(row.getValue("created_at")), "dd MMM yyyy"),
    },
    {
      accessorKey: "expires_at",
      header: "Expires",
      cell: ({ row }) => {
        const value = row.getValue<string | null>("expires_at");
        if (!value) return <span className="text-muted-foreground">—</span>;
        return format(new Date(value), "dd MMM yyyy, HH:mm");
      },
    },
    {
      id: "actions",
      // Prevent this column from being toggled off in view options
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;

        // Only show update status option for orders the vendor can act on
        const canUpdateStatus = VENDOR_UPDATABLE_STATUSES.some(
          (s) => s !== order.status,
        );

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <span className="sr-only">Open actions</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView(order)}>
                View order
              </DropdownMenuItem>
              {canUpdateStatus && (
                <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                  Update status
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
