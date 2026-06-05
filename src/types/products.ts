export type ProductStatus =
  | "selling"
  | "out_of_stock"
  | "published"
  | "unpublished";

export enum ProductMode {
  SALE = "sale",
  SALE_SWAP = "sale_swap",
}

export type ProductVariant = {
  id: string;
  color: string;
  storage: number;
  price: number;
  stock_quantity: number;
  created_at: string;
};

export type Product = {
  id?: string;
  name: string;
  condition: string;
  carrier_status: string;
  base_price: number;
  mode: ProductMode;
  total_stock: number;
  images: string[];
  specifications: { key: string; value: string }[];
  is_swappable: boolean;
  is_active: boolean;
  brand: { id: string; brand_name: string };
  category: { id: string; name: string; type: string };
  variants: ProductVariant[];
  variantCount: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  description: string;
  status: ProductStatus;
  subcategory: { id: string; name: string };
};

// export type ProductsQueryParams = {
//   page?: number;
//   limit?: number;
//   search?: string;
//   category?: string;
//   price?: string;
//   is_active?: string;
//   status?: string;
//   sort_order?: string;
// };

// export type ProductsApiResponse = {
//   products: Product[];
//   total: number;
//   page: number;
//   limit: number;
// };

// export type ProductsResponse = {
//   data: Product[];
//   pagination: Pagination;
// };

// export type ProductFormData = Omit<
//   Product,
//   | "brand"
//   | "category"
//   | "total_stock"
//   | "is_swappable"
//   | "is_active"
//   | "created_at"
//   | "updated_at"
//   | "deleted_at"
//   | "images"
// > & {
//   brand_id: string;
//   category_id: string;
// };
