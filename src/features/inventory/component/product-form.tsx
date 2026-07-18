"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";

import { Trash2 } from "lucide-react";

import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Spinner } from "@/components/ui/spinner";
import SpecificationsSection from "./specification-section";
import { ProductImageUpload } from "./product-image-upload";
import { useCategories } from "@/hooks/services/use-categories";
import { useCreateProduct } from "@/hooks/services/use-products";
import { ProductFormData, ProductFormSchema } from "@/schemas/product";
import { ProductMode } from "../types";
import { useBrands } from "@/hooks/services/use-brand";
import { normalizePayload } from "@/helpers/format";

const defaultValues: ProductFormData = {
  name: "",
  brand_id: "",
  category_id: "",
  subcategory_id: "",

  condition: "NEW",

  mode: ProductMode.SALE,

  carrier_status: undefined,

  description: "",

  images: [],

  base_price: "",

  total_stock: "",

  variants: [],

  specifications: [],
};

type Props = {
  onSuccessAction?: () => void;
};

export default function AddProductForm({ onSuccessAction }: Props) {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categoriesData, isLoading: catLoading } = useCategories();
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),

    values: defaultValues,
  });

  const selectedCategoryId = form.watch("category_id");

  const selectedCategory = useMemo(() => {
    return categoriesData?.categories.find(
      (category) => category.id === selectedCategoryId,
    );
  }, [selectedCategoryId]);

  const variants = useFieldArray({
    control: form.control,
    name: "variants",
  });

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
    })) ?? [];

  const supportsVariants = selectedCategory?.supports_variants;

  const supportsStock = selectedCategory?.supports_stock_tracking;

  const supportsCarrierStatus = selectedCategory?.supports_carrier_status;

  const onSubmit = (data: ProductFormData) => {
    if (supportsVariants && data.variants.length === 0) {
      toast.error("At least one variant is required for this category");
      return;
    }

    if (supportsStock && data.total_stock?.trim() === "") {
      toast.error("Stock quantity is required for this category");
      return;
    }

    if (
      supportsCarrierStatus &&
      (!data.carrier_status || data.carrier_status.trim() === "")
    ) {
      toast.error("Carrier status is required for this category");
      return;
    }

    const payload = normalizePayload(data);

    createProduct(payload, {
      onSuccess: () => {
        toast.success("Product created successfully");

        form.reset(defaultValues);

        onSuccessAction?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {" "}
        <div className="space-y-8">
          {" "}
          <section className="space-y-4">
            {" "}
            <h3 className="text-sm font-semibold uppercase">
              Basic Information{" "}
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
          <Separator />
          <section>
            <ProductImageUpload
              onImagesUploaded={(urls) => form.setValue("images", urls)}
              error={form.formState.errors.images?.message as string}
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
                placeholder="Select Carrier status"
              />
            </>
          )}
          {supportsStock && (
            <>
              <Separator />

              <FormInput
                control={form.control}
                name="total_stock"
                label="Stock Quantity"
                placeholder="enter stock quantity"
              />
            </>
          )}
          {supportsVariants && (
            <>
              <Separator />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase">Variants</h3>

                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() =>
                      variants.append({
                        color: "",
                        storage: "",
                        price: "",
                        stock_quantity: "",
                      })
                    }
                  >
                    Add Variant
                  </Button>
                </div>

                {variants.fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Variant {index + 1}</p>
                      {variants.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => variants.remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>

                    <FormInput
                      control={form.control}
                      name={`variants.${index}.color`}
                      label="Color"
                      placeholder="Blue Titanium"
                    />

                    <FormInput
                      control={form.control}
                      name={`variants.${index}.storage`}
                      label="Storage (GB)"
                      placeholder="256"
                    />

                    <FormInput
                      control={form.control}
                      name={`variants.${index}.price`}
                      label="Price"
                      placeholder="1099.99"
                    />

                    <FormInput
                      control={form.control}
                      name={`variants.${index}.stock_quantity`}
                      label="Stock Quantity"
                      placeholder="25"
                    />
                  </div>
                ))}
              </section>
            </>
          )}
          <Separator />
          <SpecificationsSection
            control={form.control}
            specifications={specifications}
          />
        </div>
        <SheetFooter className="bg-background/80 sticky bottom-0 mt-8 border-t pt-4 backdrop-blur">
          <Button disabled={isPending} className="cursor-pointer" type="submit">
            {isPending ? (
              <span className="inline-flex items-center">
                <Spinner className="mr-2" />
                Creating...
              </span>
            ) : (
              "Create Product"
            )}
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
