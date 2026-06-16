import { brandsEndpoints, BrandsResponse } from "@/services/brand";
import { KeyedApiResponse } from "@/types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useBrands(
  options?: Omit<
    UseQueryOptions<KeyedApiResponse<BrandsResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => brandsEndpoints.fetchBrands(),
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}
