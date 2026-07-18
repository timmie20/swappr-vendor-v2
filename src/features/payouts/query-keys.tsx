import type { PayoutQueryParams } from "./types";

export const payoutQueryKeys = {
  all: () => ["payouts"] as const,

  lists: () => [...payoutQueryKeys.all(), "list"] as const,

  list: (params: PayoutQueryParams) =>
    [...payoutQueryKeys.lists(), params] as const,

  // The summary tiles — no params, fetched once and never invalidated by
  // list filtering since it doesn't share a query key with list()/lists()
  summary: () => [...payoutQueryKeys.all(), "summary"] as const,
} as const;
