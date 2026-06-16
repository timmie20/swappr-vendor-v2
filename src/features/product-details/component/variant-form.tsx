"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/forms/form-input";
import { ProductVariant } from "@/features/inventory/types";
import { VariantFormData, VariantFormSchema } from "@/schemas/product";
import { Spinner } from "@/components/ui/spinner";
import { useAddVariant, useUpdateVariant } from "@/hooks/services/use-products";

type VariantFormProps = {
  productId: string;
  isOpen?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
  variant?: ProductVariant | null;
  children: React.ReactNode;
  onSuccessAction?: () => void;
};

export default function VariantForm({
  productId,
  isOpen,
  onOpenChangeAction,
  variant,
  children,
  onSuccessAction,
}: VariantFormProps) {
  const { mutate: addVariant, isPending: isAdding } = useAddVariant();
  const { mutate: updateVariant, isPending: isUpdating } = useUpdateVariant();

  const isEdit = !!variant;

  const form = useForm<VariantFormData>({
    resolver: zodResolver(VariantFormSchema),
    values: variant
      ? {
          color: variant.color,
          storage: String(variant.storage),
          price: String(variant.price),
          stock_quantity: String(variant.stock_quantity),
        }
      : {
          color: "",
          storage: "",
          price: "",
          stock_quantity: "",
        },
  });

  function onSubmit(data: VariantFormData) {
    const payload = {
      color: data.color,
      storage: Number(data.storage),
      price: Number(data.price),
      stock_quantity: Number(data.stock_quantity),
    };

    if (isEdit && variant) {
      updateVariant(
        { productId, variantId: variant.id, variant: payload },
        {
          onSuccess: () => {
            form.reset();
            onSuccessAction?.();
          },
        },
      );
    } else {
      addVariant(
        { productId, variant: payload },
        {
          onSuccess: () => {
            form.reset();
            onSuccessAction?.();
          },
        },
      );
    }
  }

  const isPending = isAdding || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeAction}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Variant" : "Add Variant"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this product variant."
              : "Enter the details for the new product variant."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-6 space-y-4">
              <FormInput
                control={form.control}
                name="color"
                label="Color"
                placeholder="e.g. Black, White, Red"
              />

              <FormInput
                control={form.control}
                name="storage"
                label="Storage Capacity (GB)"
                placeholder="e.g. 128, 256, 512"
              />

              <FormInput
                control={form.control}
                name="price"
                label="Price"
                placeholder="999.99"
              />

              <FormInput
                control={form.control}
                name="stock_quantity"
                label="Stock Quantity"
                placeholder="e.g. 10"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isAdding || isUpdating ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Saving
                  </span>
                ) : isEdit ? (
                  "Update Variant"
                ) : (
                  "Add Variant"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
