"use client";

import { useTableState } from "@/hooks/use-table-state";
import { useFilterState } from "@/hooks/use-filter-state";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useOrders } from "@/hooks/services/use-orders";
import { getOrderColumns } from "../column";
import { DataTable } from "@/components/table/data-table";
import { Order, OrderQueryParams, OrderStatus } from "../types";
import { FilterConfig } from "@/types/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useRouter } from "next/navigation";
import { AdvanceStatusDialog } from "./advance-status-dialog";
import { CancelOrderDialog } from "./cancel-order-dialog";

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

  const route = useRouter();

  const { data, isLoading, isError, isFetching } = useOrders({
    ...queryParams,
    ...(activeFilters as Partial<OrderQueryParams>),
  });

  // const handleOnView = (orderNumber: string) => {
  //   route.push(`/orders/${orderNumber}`);
  // };

  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);

  const columns = useMemo(
    () =>
      getOrderColumns({
        // onView: (orderNumber: string) => handleOnView(orderNumber),
        onUpdateStatus: (order: Order) => setStatusOrder(order),
        onCancelOrder: (order: Order) => setCancelOrder(order),
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
    <>
      <DataTable
        table={table}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
      >
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

      <AdvanceStatusDialog
        order={statusOrder}
        open={!!statusOrder}
        onOpenChange={(open) => !open && setStatusOrder(null)}
      />
      <CancelOrderDialog
        order={cancelOrder}
        open={!!cancelOrder}
        onOpenChange={(open) => !open && setCancelOrder(null)}
      />
    </>
  );
}
