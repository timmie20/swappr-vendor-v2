// src/hooks/use-filter-state.ts
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
import { useCallback, useMemo } from "react";

// src/hooks/use-filter-state.ts
type FilterShape = Record<string, string | string[]>;

export function useFilterState<T extends FilterShape>(initialFilters: T) {
  const parsers = Object.fromEntries(
    Object.entries(initialFilters).map(([key, defaultValue]) => [
      key,
      // Arrays stored as comma-separated strings in the URL
      // e.g. category_ids=uuid-1,uuid-2,uuid-3
      parseAsString.withDefault(
        Array.isArray(defaultValue) ? defaultValue.join(",") : defaultValue,
      ),
    ]),
  );

  const [filterParams, setFilterParams] = useQueryStates(
    parsers as any, // nuqs internal generic is too strict for dynamic keys
    { history: "replace" },
  );

  const onFilterChange = useCallback(
    (key: string, value: string | string[] | undefined) => {
      const serialized = Array.isArray(value)
        ? value.join(",") // [uuid-1, uuid-2] → "uuid-1,uuid-2"
        : (value ?? null);
      setFilterParams((prev) => ({ ...prev, [key]: serialized }));
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
