import { TableQueryParams } from "@/hooks/use-table-state";

export enum ProductStatus {
  SELLING = "selling",
  OUT_OF_STOCK = "out_of_stock",
}

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

export type PaginatedProducts = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
};

export type ProductQueryParams = TableQueryParams & {
  category_ids?: string;
  status?: ProductStatus;
};

export interface BulkTogglePublishPayload {
  ids: string[];
  is_active: boolean;
}

export interface BulkDeletePayload {
  ids: string[];
}

export interface CreateProductPayload {
  name: string;
  brand_id: string;
  category_id: string;
  subcategory_id?: string;

  condition: string;

  mode: ProductMode;

  description: string;

  total_stock?: number;

  base_price?: number;

  carrier_status?: string;

  images: string[];

  specifications: {
    key: string;
    value: string;
  }[];

  variants: {
    color: string;
    storage: number;
    price: number;
    stock_quantity: number;
  }[];
}
