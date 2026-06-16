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
import { useAddVariant, useUpdateVariant } from "@/hooks/services/use-products";

type VariantFormProps = {
  productId: string;
  variant?: ProductVariant;
  children: React.ReactNode;
  onSuccessAction?: () => void;
};

export default function VariantForm({
  productId,
  variant,
  children,
  onSuccessAction,
}: VariantFormProps) {
  const isEdit = !!variant;

  const { mutate: addVariant, isPending: isAdding } = useAddVariant();
  const { mutate: updateVariant, isPending: isUpdating } = useUpdateVariant();

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
    if (isEdit && variant) {
      updateVariant(
        { productId, variantId: variant.id, variant: data },
        {
          onSuccess: () => {
            form.reset();
            onSuccessAction?.();
          },
        },
      );
    } else {
      addVariant(
        { productId, variant: data },
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
    <Dialog>
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
                type="number"
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
                type="number"
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isPending}>
                {isEdit ? "Update Variant" : "Add Variant"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
