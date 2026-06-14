"use client";

import { useProducts } from "@/hooks/services/use-products";
import { useFilterState } from "@/hooks/use-filter-state";
import { useTableState } from "@/hooks/use-table-state";
import React, { useMemo } from "react";
import { ProductQueryParams, ProductStatus } from "../types";
import { getProductColumns } from "../column";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { FilterConfig } from "@/types/data-table";

// Defined outside the component — stable reference, no recreation on render
const STATUS_FILTER_OPTIONS = Object.values(ProductStatus).map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}));

const ORDER_FILTERS: FilterConfig[] = [
  {
    type: "select",
    key: "status",
    label: "Status",
    options: STATUS_FILTER_OPTIONS,
  },
  {
    type: "multi-select",
    key: "category",
    label: "Category",
    options: [],
  },
];

export default function InventoryTable() {
  const {
    tableState,
    onPaginationChange,
    onSortingChange,
    searchValue,
    onSearchChange,
    queryParams,
  } = useTableState();

  const {
    filterValues,
    onFilterChange,
    onResetFilters,
    hasActiveFilters,
    activeFilters,
  } = useFilterState({ status: "", category: "" });

  const { data, isLoading, isError, isFetching } = useProducts({
    ...queryParams,
    ...(activeFilters as Partial<ProductQueryParams>),
  });

  const columns = useMemo(
    () =>
      getProductColumns({
        onEdit: (product) => console.log("edit", product),
        onDelete: (product) => console.log("delete", product),
        onTogglePublish: (product) => console.log("toggle status", product),
      }),
    [],
  );

  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    rowCount: data?.total ?? 0,
    state: tableState,
    manualPagination: true,
    manualSorting: true,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
    >
      <DataTableToolbar
        searchPlaceholder="Search products"
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        filters={ORDER_FILTERS}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </DataTable>
  );
}
