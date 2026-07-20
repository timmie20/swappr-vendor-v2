import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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

import {
  type Order,
  FulfillmentType,
  OrderStatus,
  canCancelOrder,
  getNextOrderStatus,
} from "./types";
import { Icons } from "@/components/shared/icons";
import {
  FULFILLMENT_BADGE_MAP,
  PAYMENT_BADGE_MAP,
  STATUS_BADGE_MAP,
} from "@/constants/badge";
import { formatCurrency } from "@/helpers/format";
import Link from "next/link";

// Columns are a plain function — no hooks, no side effects.
// Actions are injected as callbacks so this file stays pure.
interface GetOrderColumnsOptions {
  // onView: (orderNumber: string) => void;
  onUpdateStatus: (order: Order) => void;
  onCancelOrder: (order: Order) => void;
}

export function getOrderColumns({
  // onView,
  onUpdateStatus,
  onCancelOrder,
}: GetOrderColumnsOptions): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "order_number",
      header: "Order Number",

      cell: ({ row }) => {
        const orderNumber = row.getValue<string | null>("order_number");

        return (
          <Link
            href={`/orders/${orderNumber}`}
            className="text-primary block max-w-40 truncate font-mono text-sm hover:underline"
            title={orderNumber || "—"}
          >
            {orderNumber || "—"}
          </Link>
        );
      },
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
      id: "fulfillment_type",
      header: "Fulfillment",
      accessorFn: (order) => order.fulfillment?.fulfillment_type,
      cell: ({ row }) => {
        const type = row.getValue<FulfillmentType | undefined>(
          "fulfillment_type",
        );
        if (!type) return <span className="text-muted-foreground">—</span>;
        const { label, variant } = FULFILLMENT_BADGE_MAP[type];
        return <Badge variant={variant}>{label}</Badge>;
      },
      enableColumnFilter: true,
      meta: {
        variant: "multiSelect",
        label: "Fulfillment",
        options: Object.entries(FULFILLMENT_BADGE_MAP).map(
          ([value, { label }]) => ({ value, label }),
        ),
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

        const canUpdateStatus = getNextOrderStatus(order.status) !== null;
        const canCancel = canCancelOrder(order.status);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <span className="sr-only">Open actions</span>
                <Icons.ellipsis className="size-4" />
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
              {canCancel && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onCancelOrder(order)}
                >
                  <Icons.trash /> Cancel order
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
