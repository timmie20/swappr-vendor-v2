import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/features/order-details/components/copy-button";

import { type Payout, PayoutStatus } from "./types";
import { formatCurrency, formatDate } from "@/helpers/format";
import { PAYOUT_BADGE_MAP } from "@/constants/badge";

function DateCell({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  const formatted = formatDate(value);
  return <span title={formatted?.full}>{formatted?.relative}</span>;
}

export const payoutColumns: ColumnDef<Payout>[] = [
  // {
  //   accessorKey: "created_at",
  //   header: "Date",
  //   cell: ({ row }) => formatDate(row.getValue("created_at"))?.full ?? "—",
  // },

  {
    accessorKey: "transfer_reference",
    header: "Reference",
    cell: ({ row }) => {
      const reference = row.getValue<string>("transfer_reference");
      return (
        <div className="flex items-center gap-1">
          <span
            className="max-w-40 truncate font-mono text-sm"
            title={reference}
          >
            {reference}
          </span>
          <CopyButton value={reference} label="Reference" />
        </div>
      );
    },
  },

  {
    accessorKey: "order_id",
    header: "Order",
    cell: ({ row }) => {
      const orderId = row.getValue<string | null>("order_id");
      // Swap payouts have no associated order
      if (!orderId) return <span className="text-muted-foreground">—</span>;
      return (
        <Link
          href={`/orders/${orderId}`}
          className="text-primary block max-w-40 truncate font-mono text-sm hover:underline"
          title={orderId}
        >
          {orderId}
        </Link>
      );
    },
  },

  {
    accessorKey: "gross_amount",
    header: "Gross",
    cell: ({ row }) => formatCurrency(Number(row.getValue("gross_amount"))),
  },

  {
    accessorKey: "platform_fee",
    header: "Platform Fee",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatCurrency(Number(row.getValue("platform_fee")))}
      </span>
    ),
  },

  {
    accessorKey: "net_amount",
    header: "Net Payout",
    cell: ({ row }) => (
      <span className="font-semibold">
        {formatCurrency(Number(row.getValue("net_amount")))}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<PayoutStatus>("status");
      const { label, variant } = PAYOUT_BADGE_MAP[status];
      const failureReason = row.original.failure_reason;

      if (status === PayoutStatus.FAILED && failureReason) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={variant} className="cursor-help">
                  {label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{failureReason}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },

  {
    accessorKey: "initiated_at",
    header: "Initiated",
    // cell: ({ row }) => <DateCell value={row.getValue("initiated_at")} />,
    cell: ({ row }) => formatDate(row.getValue("initiated_at"))?.full ?? "—",
  },

  {
    accessorKey: "completed_at",
    header: "Completed",
    cell: ({ row }) => <DateCell value={row.getValue("completed_at")} />,
  },
];
