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
  Product,
} from "@/features/inventory/types";
import { productQueryKeys } from "@/features/inventory/query-keys";
import { productEndpoints } from "@/services/products";
import { toast } from "sonner";
import { getErrorMessage } from "@/helpers/get-error-message";
import { KeyedApiResponse } from "@/types";

export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => productEndpoints.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: async (): Promise<KeyedApiResponse<{ product: Product }>> => {
      return await productEndpoints.getById(id);
    },
    enabled: !!id,
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
    onError: (error) => {
      const message = getErrorMessage(error);

      toast.error("Failed to update product", {
        description: message,
      });
      return;
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

export function useAddVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variant,
    }: {
      productId: string;
      variant: Record<string, unknown>;
    }): Promise<{ message: string }> => {
      return await productEndpoints.addVariant(productId, variant);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [productQueryKeys.detail, variables.productId],
      });
      toast.success("Variant added successfully.");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);

      toast.error("Failed add variant", {
        description: message,
      });
    },
  });
}

export function useUpdateVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
      variant,
    }: {
      productId: string;
      variantId: string;
      variant: Record<string, unknown>;
    }) => {
      return await productEndpoints.updateVariant(
        productId,
        variantId,
        variant,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [productQueryKeys.detail, variables.productId],
      });
      toast.success("Variant updated successfully.");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);

      toast.error("Failed update variant", {
        description: message,
      });
    },
  });
}

export function useDeleteVariant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId: string;
    }) => {
      return await productEndpoints.deleteVariant(productId, variantId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [productQueryKeys.detail, variables.productId],
      });
      toast.success("Variant deleted successfully.");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);

      toast.error("Failed delete variant", {
        description: message,
      });
    },
  });
}
