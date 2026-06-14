"use client";

import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "../shared/icons";
import { FilterConfig } from "@/types/data-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

// ---- Props --------------------------------------------------------------

interface DataTableToolbarProps {
  // Search
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;

  // Filters
  filters?: FilterConfig[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string | string[] | undefined) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

// ---- Component ----------------------------------------------------------

export function DataTableToolbar({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  filterValues,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
}: DataTableToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((value: string) => {
    onSearchChange(value);
  }, 400);

  return (
    <div className="flex items-center justify-between gap-2 overflow-auto p-1">
      <div className="flex flex-1 items-center gap-2">
        {/* Search */}
        <Input
          ref={inputRef}
          placeholder={searchPlaceholder}
          defaultValue={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-50 lg:w-70"
        />

        {/* Dynamic filters */}
        {filters.map((filter) => {
          if (filter.type === "select") {
            return (
              <Select
                key={filter.key}
                value={filterValues[filter.key] ?? ""}
                onValueChange={(value) =>
                  // Empty string means "all" — clear the filter
                  onFilterChange(filter.key, value === "" ? undefined : value)
                }
              >
                <SelectTrigger className="h-8 w-35 border-dashed">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          // In the toolbar, multi-select branch
          if (filter.type === "multi-select") {
            const raw = (filterValues[filter.key] as string) ?? "";
            const selectedValues = raw ? raw.split(",") : [];

            return (
              <DataTableFacetedFilter
                key={filter.key}
                label={filter.label}
                options={filter.options}
                selectedValues={selectedValues}
                onChange={(values) =>
                  onFilterChange(
                    filter.key,
                    values.length > 0 ? values : undefined,
                  )
                }
              />
            );
          }
          return null;
        })}

        {/* Reset — only shown when filters are active */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              onResetFilters();
              // Also clear the search input visually
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Reset
            <Icons.close className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
