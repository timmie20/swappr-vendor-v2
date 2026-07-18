import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import { formatCurrency } from "@/helpers/format";
import { ProductVariant } from "@/features/inventory/types";

interface GetVariantColumnsOptions {
  onEdit: (variant: ProductVariant) => void;
  onDelete: (variant: ProductVariant) => void;
}

export function getVariantColumns({
  onEdit,
  onDelete,
}: GetVariantColumnsOptions): ColumnDef<ProductVariant>[] {
  return [
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("color")}</span>
      ),
    },
    {
      accessorKey: "storage",
      header: "Storage",
      cell: ({ row }) => <span>{row.getValue<number>("storage")}GB</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.getValue("price")),
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: ({ row }) => row.getValue("stock_quantity"),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => format(new Date(row.getValue("created_at")), "PPP"),
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const variant = row.original;

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
              <DropdownMenuItem onSelect={() => onEdit(variant)}>
                <Icons.edit /> Edit variant
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete(variant)}
                className="text-destructive focus:text-destructive"
              >
                <Icons.trash /> Delete variant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
