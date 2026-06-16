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
  PartialCreateProductPayload,
} from "@/features/inventory/types";
import { productQueryKeys } from "@/features/inventory/query-keys";
import { productEndpoints } from "@/services/products";
import { toast } from "sonner";
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

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PartialCreateProductPayload;
    }) => productEndpoints.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
      queryClient.invalidateQueries({
        queryKey: [productQueryKeys.detail, variables.id],
      });
    },
  });
}

export function useToggleProductPublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      productEndpoints.togglePublish(id), // your existing service call

    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all() });
      toast.success(is_active ? "Product published" : "Product unpublished");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
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
