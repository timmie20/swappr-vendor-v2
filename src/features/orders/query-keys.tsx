import type { OrderQueryParams } from "./types";

export const orderQueryKeys = {
  // Matches everything order-related — invalidate this to nuke all order cache
  all: () => ["orders"] as const,

  // Matches all order lists regardless of params
  lists: () => [...orderQueryKeys.all(), "list"] as const,

  // Matches one specific list with its exact params
  list: (params: OrderQueryParams) =>
    [...orderQueryKeys.lists(), params] as const,

  // Matches all detail views
  details: () => [...orderQueryKeys.all(), "detail"] as const,

  // Matches one specific order detail
  detail: (id: string) => [...orderQueryKeys.details(), id] as const,
} as const;
