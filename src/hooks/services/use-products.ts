import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { ProductQueryParams } from "@/features/inventory/types";
import { productQueryKeys } from "@/features/inventory/query-keys";
import { productEndpoints } from "@/services/products";

export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => productEndpoints.getAll(params),
    placeholderData: keepPreviousData,
  });
}
