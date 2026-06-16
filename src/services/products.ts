import {
  BulkDeletePayload,
  BulkTogglePublishPayload,
  CreateProductPayload,
  PaginatedProducts,
  PartialCreateProductPayload,
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

  async getById(id: string) {
    const { data } = await api.get(`/products/${id}`, {
      headers: {},
    });
    return data;
  },

  async add(payload: CreateProductPayload) {
    const { data } = await api.post("/products/create", payload);
    return data;
  },

  async update(productId: string, productData: PartialCreateProductPayload) {
    const { data } = await api.patch(
      `/products/${productId}/update`,
      productData,
    );
    return data;
  },

  async togglePublish(productID: string) {
    const { data } = await api.patch(
      `/products/${productID}/toggle-publish`,
      {},
    );
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

  async addVariant(productId: string, variant: Record<string, unknown>) {
    const { data } = await api.post(`/products/${productId}/variants`, variant);
    return data;
  },

  async updateVariant(
    productId: string,
    variantId: string,
    variant: Record<string, unknown>,
  ) {
    const { data } = await api.patch(
      `/products/${productId}/variants/${variantId}`,
      variant,
    );
    return data;
  },

  async deleteVariant(productId: string, variantId: string) {
    const { data } = await api.delete(
      `/products/${productId}/variants/${variantId}`,
    );
    return data;
  },
};
