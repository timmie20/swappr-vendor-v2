"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMemo } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { EditProductFormData, EditProductFormSchema } from "@/schemas/product";

import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import SpecificationsSection from "./specification-section";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { getChangedFieldsExcluding } from "@/helpers/format";
import { useCategories } from "@/hooks/services/use-categories";
import { useBrands } from "@/hooks/services/use-brand";
import { CategoryType } from "@/types/category";
import { useUpdateProduct } from "@/hooks/services/use-products";
import { Product } from "../types";

type FormComponentProps = {
  initialData: Product;
  onSuccessAction?: () => void;
};

export default function EditProductForm({
  onSuccessAction,
  initialData,
}: FormComponentProps) {
  const { mutate: updateProduct, isPending } = useUpdateProduct();
  const { data: categoriesData, isLoading: catLoading } = useCategories();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  const form = useForm<EditProductFormData>({
    resolver: zodResolver(EditProductFormSchema),
    values: {
      name: initialData.name,
      brand_id: initialData.brand.id,
      category_id: initialData.category.id,
      subcategory_id: initialData.subcategory.id,
      condition: initialData.condition,
      mode: initialData.mode,
      carrier_status: initialData.carrier_status ?? undefined,
      base_price: String(initialData.base_price),
      total_stock: String(initialData.total_stock),
      description: initialData.description,
      specifications: initialData.specifications,
    },
  });

  const selectedCategoryId = form.watch("category_id");

  const selectedCategory = useMemo(() => {
    return categoriesData?.categories.find(
      (category) => category.id === selectedCategoryId,
    );
  }, [categoriesData?.categories, selectedCategoryId]);

  const specifications = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const categoryOptions =
    categoriesData?.categories.map((category) => ({
      label: category.name,
      value: category.id,
    })) || [];

  const brandOptions =
    brandsData?.brands.map((brand) => ({
      label: brand.brand_name,
      value: brand.id,
    })) || [];

  const subCategoryOptions =
    selectedCategory?.sub_categories.map((subcategory) => ({
      label: subcategory.name,
      value: subcategory.id,
    })) || [];

  const supportsVariants = selectedCategory?.supports_variants;

  const supportsStock = selectedCategory?.supports_stock_tracking;

  const supportsCarrierStatus = selectedCategory?.supports_carrier_status;

  const isDirty = form.formState.isDirty;

  function onSubmit(data: EditProductFormData) {
    const raw = getChangedFieldsExcluding<any>(initialData, data);

    const payload = {
      ...raw,

      // Ensure numeric fields are properly converted
      ...(raw.base_price && { base_price: Number(raw.base_price) }),
      ...(raw.total_stock && { total_stock: Number(raw.total_stock) }),
    };

    updateProduct(
      { id: initialData.id || "", payload },
      {
        onSuccess: () => {
          onSuccessAction?.();
          toast.success("Product Updated successfully!");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to Update product");
        },
      },
    );
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase">
              Basic Information
            </h3>

            <FormInput
              control={form.control}
              name="name"
              label="Product Name"
              placeholder="iPhone 16 Pro"
            />

            <FormSelect
              control={form.control}
              name="brand_id"
              label="Brand"
              options={brandOptions}
              placeholder="Select a Brand"
              disabled={brandsLoading || brandOptions.length === 0}
            />

            <FormSelect
              control={form.control}
              name="category_id"
              label="Category"
              options={categoryOptions}
              placeholder="Select a Category"
              disabled={catLoading || categoryOptions.length === 0}
            />

            <FormSelect
              control={form.control}
              name="subcategory_id"
              label="Sub Category"
              options={subCategoryOptions}
              placeholder="Select a Sub Category"
              disabled={subCategoryOptions.length === 0}
            />

            <FormSelect
              control={form.control}
              name="condition"
              label="Condition"
              options={[
                { label: "New", value: "NEW" },
                { label: "Used", value: "UK_USED" },
                { label: "Eko Friendly", value: "EKO_FRIENDLY" },
              ]}
            />

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe the product..."
            />
          </section>

          {!supportsVariants && (
            <>
              <Separator />
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase">Pricing</h3>

                <FormInput
                  placeholder="enter price"
                  control={form.control}
                  name="base_price"
                  label="Base Price"
                />
              </section>
            </>
          )}

          {supportsCarrierStatus && (
            <>
              <Separator />

              <FormSelect
                control={form.control}
                name="carrier_status"
                label="Carrier Status"
                options={[
                  { label: "Unlocked", value: "unlocked" },
                  { label: "Locked", value: "locked" },
                ]}
              />
            </>
          )}

          {supportsStock && (
            <>
              <Separator />

              <FormInput
                control={form.control}
                name="total_stock"
                label=" Stock Quantity"
                placeholder="enter stock quantity"
              />
            </>
          )}

          <Separator />
          <SpecificationsSection
            control={form.control}
            specifications={specifications}
          />
        </div>

        <SheetFooter className="bg-background/80 sticky bottom-0 mt-8 border-t pt-4 backdrop-blur">
          <Button disabled={!isDirty || isPending} type="submit">
            {isPending ? (
              <span className="inline-flex items-center">
                <Spinner className="mr-2" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}{" "}
          </Button>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
