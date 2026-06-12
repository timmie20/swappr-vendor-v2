// src/hooks/use-filter-state.ts
import { useQueryStates, parseAsString } from "nuqs";
import { useCallback, useMemo } from "react";

type FilterShape = Record<string, string>;

export function useFilterState<T extends FilterShape>(initialFilters: T) {
  const parsers = Object.fromEntries(
    Object.entries(initialFilters).map(([key, defaultValue]) => [
      key,
      parseAsString.withDefault(defaultValue),
    ]),
  );

  const [filterParams, setFilterParams] = useQueryStates(
    parsers as any, // nuqs internal generic is too strict for dynamic keys
    { history: "replace" },
  );

  const onFilterChange = useCallback(
    (key: string, value: string | undefined) => {
      setFilterParams((prev) => ({ ...prev, [key]: value ?? null }));
    },
    [setFilterParams],
  );

  const onResetFilters = useCallback(() => {
    setFilterParams(
      (prev) =>
        Object.fromEntries(Object.keys(prev).map((key) => [key, null])) as any,
    );
  }, [setFilterParams]);

  const hasActiveFilters = useMemo(
    () => Object.values(filterParams).some((v) => v !== ""),
    [filterParams],
  );

  return {
    filterValues: filterParams as unknown as T,
    onFilterChange,
    onResetFilters,
    hasActiveFilters,
    activeFilters: Object.fromEntries(
      Object.entries(filterParams).filter(([_, v]) => v !== ""),
    ) as unknown as Partial<T>,
  };
}
