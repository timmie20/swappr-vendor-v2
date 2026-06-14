import { categoriesEndpoints } from "@/services/categories";
import { KeyedApiResponse } from "@/types";
import { CategoriesResponse } from "@/types/category";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const categoriesQueryKeys = {
  all: ["categories"] as const,
};

export function useCategories(
  options?: Omit<
    UseQueryOptions<KeyedApiResponse<CategoriesResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: async () => categoriesEndpoints.fetchCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}
