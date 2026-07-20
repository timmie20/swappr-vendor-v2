"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useTableState } from "@/hooks/use-table-state";
import { useFilterState } from "@/hooks/use-filter-state";
import { usePayouts } from "@/hooks/services/use-payouts";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { FilterConfig } from "@/types/data-table";

import { payoutColumns } from "../column";
import { PayoutQueryParams, PayoutStatus } from "../types";
import { PayoutAmountRangeFilter } from "./payout-amount-range-filter";
import { PayoutDateRangeFilter } from "./payout-date-range-filter";

// Static — no data dependency, safe outside the component
const STATUS_FILTER_OPTIONS = Object.values(PayoutStatus).map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}));

const PAYOUT_FILTERS: FilterConfig[] = [
  {
    type: "select",
    key: "status",
    label: "Status",
    options: STATUS_FILTER_OPTIONS,
  },
];

export default function PayoutsTable() {
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
    onFilterChangeMultiple,
    onResetFilters,
    hasActiveFilters,
    activeFilters,
  } = useFilterState({
    status: "",
    min_amount: "",
    max_amount: "",
    created_from: "",
    created_to: "",
  });

  const { data, isLoading, isError, isFetching } = usePayouts({
    ...queryParams,
    ...(activeFilters as Partial<PayoutQueryParams>),
  });

  const table = useReactTable({
    data: data?.payouts ?? [],
    columns: payoutColumns,
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
        searchPlaceholder="Search by reference"
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        filters={PAYOUT_FILTERS}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        hasActiveFilters={hasActiveFilters}
      >
        <PayoutAmountRangeFilter
          minValue={filterValues.min_amount}
          maxValue={filterValues.max_amount}
          onMinChange={(value) => onFilterChange("min_amount", value)}
          onMaxChange={(value) => onFilterChange("max_amount", value)}
        />
        <PayoutDateRangeFilter
          from={filterValues.created_from || undefined}
          to={filterValues.created_to || undefined}
          onChange={(from, to) =>
            onFilterChangeMultiple({
              created_from: from,
              created_to: to,
            })
          }
        />
      </DataTableToolbar>
    </DataTable>
  );
}
