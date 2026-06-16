"use client";

import React, { useMemo } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { useDeleteVariant } from "@/hooks/services/use-products";
import { getVariantColumns } from "./column";
import { ProductVariant } from "@/features/inventory/types";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import VariantForm from "../variant-form";
import { Button } from "@/components/ui/button";
import { DeleteAction } from "@/components/resuable-delete-dialog";

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
  const [openVariantForm, setOpenVariantForm] = React.useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [variantToEdit, setVariantToEdit] =
    React.useState<ProductVariant | null>(null);

  const { mutate: deleteVariant, isPending: isDeleting } = useDeleteVariant();

  const handleEdit = (variant: ProductVariant) => {
    requestAnimationFrame(() => {
      setVariantToEdit(variant);
      setOpenVariantForm(true);
    });
  };

  const handleDeleteTrigger = (variant: ProductVariant) => {
    requestAnimationFrame(() => {
      setVariantToEdit(variant);
      setOpenDeleteDialog(true);
    });
  };

  const handleDelete = (variantId: string) => {
    if (!variantToEdit) return;

    deleteVariant(
      { productId, variantId },
      {
        onSuccess: () => {
          setOpenDeleteDialog(false);
          setVariantToEdit(null);
        },
      },
    );
  };

  const onSuccess = () => {
    requestAnimationFrame(() => {
      setVariantToEdit(null);
      setOpenVariantForm(false);
    });
  };

  const onEditDialogOpenChange = (open: boolean) => {
    if (!open) {
      setVariantToEdit(null);
    }
    setOpenVariantForm(open);
  };

  const onDeleteDialogOpenChange = (open: boolean) => {
    if (!open) {
      setVariantToEdit(null);
    }
    setOpenDeleteDialog(open);
  };

  const columns = useMemo(
    () =>
      getVariantColumns({
        onEdit: (variant) => handleEdit(variant),
        onDelete: (variant) => handleDeleteTrigger(variant),
      }),
    [productId, deleteVariant],
  );

  const table = useReactTable({
    data: variants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <React.Fragment>
      <div className="mb-4 flex items-center justify-between">
        {isLoading ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <Typography variant="h2">Product Variants</Typography>
        )}

        <VariantForm
          productId={productId}
          isOpen={openVariantForm}
          onOpenChangeAction={onEditDialogOpenChange}
          variant={variantToEdit}
          onSuccessAction={onSuccess}
        >
          <Button size="lg" className="w-auto text-base" disabled={isLoading}>
            Add Variant
          </Button>
        </VariantForm>
      </div>

      <DataTable table={table} isLoading={isLoading} />

      <DeleteAction
        entityName={`${variantToEdit?.color} / ${variantToEdit?.storage}GB`}
        isPending={isDeleting}
        isOpen={openDeleteDialog}
        onOpenChange={onDeleteDialogOpenChange}
        handleConfirm={() => handleDelete(variantToEdit?.id ?? "")}
      />
    </React.Fragment>
  );
}
