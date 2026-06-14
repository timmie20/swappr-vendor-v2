import type { ProductQueryParams } from "./types";

export const productQueryKeys = {
  all: () => ["products"] as const,

  lists: () => [...productQueryKeys.all(), "list"] as const,

  list: (params: ProductQueryParams) =>
    [...productQueryKeys.lists(), params] as const,

  details: () => [...productQueryKeys.all(), "detail"] as const,

  detail: (id: string) => [...productQueryKeys.details(), id] as const,
} as const;
