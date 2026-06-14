import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";

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
import { Icons } from "@/components/shared/icons";
import { PAYMENT_BADGE_MAP, STATUS_BADGE_MAP } from "@/constants/badge";
import { formatCurrency } from "@/helpers/format";
import Link from "next/link";

// Columns are a plain function — no hooks, no side effects.
// Actions are injected as callbacks so this file stays pure.
interface GetOrderColumnsOptions {
  // onView: (orderNumber: string) => void;
  onUpdateStatus: (order: Order) => void;
}

export function getOrderColumns({
  // onView,
  onUpdateStatus,
}: GetOrderColumnsOptions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "order_number",
      header: "Order Number",

      cell: ({ row }) => (
        <span className="font-mono text-sm font-medium">
          {row.getValue("order_number")}
        </span>
      ),
      meta: {
        label: "Search",
        placeholder: "Search orders by number or customer",
        variant: "text",
      },
      enableColumnFilter: true,
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
      enableColumnFilter: true,
      meta: {
        variant: "multiSelect",
        label: "Status",
        options: Object.entries(STATUS_BADGE_MAP).map(([value, { label }]) => ({
          value,
          label,
        })),
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue<string>("payment_status");
        const { label, variant } = PAYMENT_BADGE_MAP[status] ?? {
          label: status,
          variant: "outline",
        };
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("total_amount")),
    },
    {
      accessorKey: "created_at",
      header: "Placed",
      cell: ({ row }) =>
        format(new Date(row.getValue("created_at")), "dd MMM yyyy, h:mm:a"),
    },
    {
      accessorKey: "expires_at",
      header: "Expires",
      cell: ({ row }) => {
        const value = row.getValue<string | null>("expires_at");
        if (!value) return <span className="text-muted-foreground">—</span>;
        return format(new Date(value), "dd MMM yyyy, h:mm:a");
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
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/orders/${order.order_number}`}>
                  <Icons.eye /> View Order
                </Link>
              </DropdownMenuItem>
              {canUpdateStatus && (
                <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
                  <Icons.edit /> Update status
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
