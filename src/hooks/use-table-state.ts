import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { useCallback } from "react";
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

const tableParsers = {
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
  sort_by: parseAsString.withDefault("created_at"),
  sort_order: parseAsStringEnum(["ASC", "DESC"] as const).withDefault("DESC"),
  search: parseAsString.withDefault(""),
};

export type TableQueryParams = {
  page: number;
  limit: number;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  search: string;
};

export function useTableState() {
  const [params, setParams] = useQueryStates(tableParsers, {
    // Shallow routing — don't push a new history entry on every
    // filter change; replace instead so back button still works
    // for actual page navigations
    history: "replace",
  });

  // --- Pagination ---
  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const current: PaginationState = {
        pageIndex: params.page - 1,
        pageSize: params.limit,
      };
      const next = typeof updater === "function" ? updater(current) : updater;

      setParams({
        page: next.pageIndex + 1,
        limit: next.pageSize,
      });
    },
    [params.page, params.limit, setParams],
  );

  // --- Sorting ---
  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updater) => {
      const current: SortingState = params.sort_by
        ? [{ id: params.sort_by, desc: params.sort_order === "DESC" }]
        : [];
      const next = typeof updater === "function" ? updater(current) : updater;

      setParams({
        sort_by: next[0]?.id ?? "",
        sort_order: next[0]?.desc ? "DESC" : "ASC",
        page: 1, // reset on sort change
      });
    },
    [params.sort_by, params.sort_order, setParams],
  );

  // --- Search ---
  const onSearchChange = useCallback(
    (value: string) => {
      setParams({ search: value, page: 1 }); // reset on search change
    },
    [setParams],
  );

  return {
    // TanStack Table controlled state
    tableState: {
      pagination: {
        pageIndex: params.page - 1,
        pageSize: params.limit,
      },
      sorting: params.sort_by
        ? [{ id: params.sort_by, desc: params.sort_order === "DESC" }]
        : ([] as SortingState),
    },

    // TanStack Table change handlers
    onPaginationChange,
    onSortingChange,

    // Search
    searchValue: params.search,
    onSearchChange,

    // Pass directly into your query hook
    queryParams: {
      page: params.page,
      limit: params.limit,
      sort_by: params.sort_by,
      sort_order: params.sort_order,
      search: params.search,
    } satisfies TableQueryParams,
  };
}
