import { ProductMode } from "@/features/inventory/types";
import * as z from "zod";

export const VariantFormSchema = z.object({
  color: z.string().min(1, "Color is required"),

  storage: z.string().min(1, "Storage is required"),

  price: z.string().min(1, "Price is required"),

  stock_quantity: z.string().min(1, "Stock quantity is required"),
});

export type VariantFormData = z.infer<typeof VariantFormSchema>;

const ProductSpecificationSchema = z.object({
  key: z.string().min(1, "Specification name is required"),
  value: z.string().min(1, "Specification value is required"),
});

export type ProductSpecificationFormData = z.infer<
  typeof ProductSpecificationSchema
>;
export const ProductFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  brand_id: z.string().min(1, "Brand is required"),

  category_id: z.string().min(1, "Category is required"),

  subcategory_id: z.string().optional(),

  condition: z.string().min(1, "Condition is required"),

  mode: z.enum([ProductMode.SALE, ProductMode.SALE_SWAP]),

  description: z.string().min(15, "Description is required"),

  total_stock: z.string().optional(),

  base_price: z.string().optional(),

  carrier_status: z.string().optional(),

  images: z.array(z.string()).min(1, "At least one image is required"),

  variants: z.array(VariantFormSchema).default([]),

  specifications: z.array(ProductSpecificationSchema).default([]),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

export const EditProductFormSchema = ProductFormSchema.omit({
  images: true,
  variants: true,
}).extend({
  id: z.string().optional(),
});

export type EditProductFormData = z.infer<typeof EditProductFormSchema>;
