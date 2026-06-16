"use client";

import { useMemo } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { useDeleteVariant } from "@/hooks/services/use-products";
import { getVariantColumns } from "./column";
import { ProductVariant } from "@/features/inventory/types";

interface VariantTableProps {
  productId: string;
  variants: ProductVariant[];
  isLoading?: boolean;
}

export function VariantTable({
  productId,
  variants,
  isLoading,
}: VariantTableProps) {
  const { mutate: deleteVariant } = useDeleteVariant();

  const columns = useMemo(
    () =>
      getVariantColumns({
        onEdit: (variant) => console.log("edit", variant), // replace when wiring dialog
        onDelete: (variant) =>
          deleteVariant({ productId, variantId: variant.id }),
      }),
    [productId, deleteVariant],
  );

  const table = useReactTable({
    data: variants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} isLoading={isLoading} />;
}
