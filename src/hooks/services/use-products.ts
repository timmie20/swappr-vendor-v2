import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  BulkDeletePayload,
  BulkTogglePublishPayload,
  CreateProductPayload,
  ProductQueryParams,
} from "@/features/inventory/types";
import { productQueryKeys } from "@/features/inventory/query-keys";
import { productEndpoints } from "@/services/products";
import { toast } from "sonner";
import { ProductFormData } from "@/schemas/product";
import { getErrorMessage } from "@/helpers/get-error-message";

export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => productEndpoints.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      productEndpoints.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
    },
    onError: (error) => {
      const message = getErrorMessage(error);

      console.error("Failed to create product:", message);

      toast.error("Failed to create product", {
        description: message,
      });
      return;
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkDeletePayload) =>
      productEndpoints.bulkDelete(payload),
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
      toast.success(
        `${ids.length} product${ids.length > 1 ? "s" : ""} deleted`,
      );
    },
    onError: () => {
      toast.error("Failed to delete products. Please try again.");
    },
  });
}

export function useBulkToggleProductPublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkTogglePublishPayload) =>
      productEndpoints.bulkToggle(payload), // your existing service call
    onSuccess: (_, { ids, is_active }) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
      toast.success(
        `${ids.length} product${ids.length > 1 ? "s" : ""} ${is_active ? "published" : "unpublished"}`,
      );
    },
    onError: () => {
      toast.error("Failed to update products. Please try again.");
    },
  });
}
