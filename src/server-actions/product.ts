import {
  PaginatedProducts,
  Product,
  ProductQueryParams,
} from "@/features/inventory/types";
import { serverFetch } from "@/lib/api/server";
import { KeyedApiResponse } from "@/types";

export async function fetchProducts(
  params?: ProductQueryParams,
): Promise<PaginatedProducts> {
  const res = await serverFetch<PaginatedProducts>("/vendors/me/products", {
    params: params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null) // strip undefined/null
            .map(([k, v]) => [k, String(v)]), // coerce all values to string
        )
      : undefined,
  });
  return res;
}

export async function fetchProductDetails(
  id: string,
): Promise<KeyedApiResponse<{ product: Product }>> {
  const res = await serverFetch<KeyedApiResponse<{ product: Product }>>(
    `/products/${id}`,
  );
  return res;
}
