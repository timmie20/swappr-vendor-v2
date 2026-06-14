import {
  PaginatedProducts,
  ProductQueryParams,
} from "@/features/inventory/types";
import { api } from "@/lib/api/client";

export const productEndpoints = {
  async getAll(params?: ProductQueryParams): Promise<PaginatedProducts> {
    const { data } = await api.get("vendors/me/products", {
      params,
    });
    return data;
  },
};
