import {
  BulkDeletePayload,
  BulkTogglePublishPayload,
  CreateProductPayload,
  PaginatedProducts,
  ProductQueryParams,
} from "@/features/inventory/types";
import { api } from "@/lib/api/client";
import { ProductFormData } from "@/schemas/product";

export const productEndpoints = {
  async getAll(params?: ProductQueryParams): Promise<PaginatedProducts> {
    const { data } = await api.get("vendors/me/products", {
      params,
    });
    return data;
  },

  async add(payload: CreateProductPayload) {
    const { data } = await api.post("/products/create", payload);
    return data;
  },

  async bulkDelete(payload: BulkDeletePayload) {
    const { data } = await api.post("/products/bulk-delete", payload);
    return data;
  },

  async bulkToggle(payload: BulkTogglePublishPayload) {
    const { data } = await api.patch("/products/bulk-toggle", payload);
    return data;
  },
};
