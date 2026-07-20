// src/lib/query/prefetch.ts
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// `cache` is React's per-request cache — this ensures the same
// QueryClient instance is shared across all Server Components
// within a single request, but isolated between requests.
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
        mutations: {
          retry: 0,
        },
      },
    }),
);
