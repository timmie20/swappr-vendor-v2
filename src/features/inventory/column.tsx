import { type ColumnDef } from "@tanstack/react-table";
import { Eye, PenSquare, Trash2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import type { Product, ProductStatus } from "./types";
import { formatCurrency } from "@/helpers/format";
import { PRODUCT_BADGE_MAP } from "@/constants/badge";
import { DataTableSwitch } from "@/components/table/data-table-switch";
import { Icons } from "@/components/shared/icons";

// ---- Action callbacks ---------------------------------------------------

interface GetProductColumnsOptions {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onTogglePublish: (product: Product) => void;
}

// ---- Column definitions ------------------------------------------------

export function getProductColumns({
  onEdit,
  onDelete,
  onTogglePublish,
}: GetProductColumnsOptions): ColumnDef<Product>[] {
  return [
    // Selection
    {
      id: "select",
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },

    // Product name
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <span className="block max-w-45 truncate capitalize">
          {row.getValue("name")}
        </span>
      ),
    },

    // Category
    {
      id: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category.name}</span>
      ),
    },

    // Price
    {
      accessorKey: "base_price",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.getValue("base_price")),
    },

    // Stock
    {
      accessorKey: "total_stock",
      header: "Stock",
      cell: ({ row }) => row.getValue("total_stock"),
    },

    // Status
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<ProductStatus>("status");
        const { label, variant } = PRODUCT_BADGE_MAP[status];
        return <Badge variant={variant}>{label}</Badge>;
      },
    },

    {
      id: "published",
      header: "Published",
      enableHiding: false,
      cell: ({ row }) => (
        <DataTableSwitch
          checked={row.original.is_active}
          onToggle={() => onTogglePublish(row.original)}
        />
      ),
    },

    // Actions
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;

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
              <DropdownMenuItem asChild>
                <Link href={`/inventory/${product.id}`}>
                  <Icons.eye /> View Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Icons.edit /> Edit product
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(product)}
                className="text-destructive focus:text-destructive"
              >
                <Icons.trash /> Delete product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
