// app/(dashboard)/orders/_components/OrdersTable.tsx
"use client";

import { useTableState } from "@/hooks/use-table-state";
import { useFilterState } from "@/hooks/use-filter-state";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { useOrders } from "@/hooks/services/use-orders";
import { getOrderColumns } from "../column";
import { DataTable } from "@/components/table/data-table";
import { Order, OrderQueryParams, OrderStatus } from "../types";
import { FilterConfig } from "@/types/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";

// Defined outside the component — stable reference, no recreation on render
const STATUS_FILTER_OPTIONS = Object.values(OrderStatus).map((status) => ({
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
];

export function OrdersTable() {
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
  } = useFilterState({ status: "" });

  const { data, isLoading, isError } = useOrders({
    ...queryParams,
    ...(activeFilters as Partial<OrderQueryParams>),
  });

  const columns = useMemo(
    () =>
      getOrderColumns({
        onView: (order: Order) => console.log("view", order),
        onUpdateStatus: (order: Order) => console.log("update status", order),
      }),
    [],
  );

  const table = useReactTable({
    data: data?.orders ?? [],
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
    <DataTable table={table} isLoading={isLoading} isError={isError}>
      <DataTableToolbar
        searchPlaceholder="Search orders by number or customer"
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
