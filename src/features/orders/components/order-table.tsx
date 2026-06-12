// app/(dashboard)/orders/_components/OrdersTable.tsx  ← Client Component
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { useOrders } from "@/hooks/use-orders";
import { useTableState } from "@/hooks/use-table-state";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getOrderColumns } from "../column";
import { Order } from "../types";

export function OrdersTable() {
  const {
    tableState,
    onPaginationChange,
    onSortingChange,
    searchValue,
    onSearchChange,
    queryParams,
  } = useTableState();

  const { data, isLoading, isError } = useOrders(queryParams);

  const onView = (order: Order) => {
    console.log("Update status for order:", order);
  };

  const onUpdateStatus = (order: Order) => {
    console.log("View details for order:", order);
  };

  const columns = getOrderColumns({ onView, onUpdateStatus });

  const table = useReactTable({
    data: data?.orders ?? [],
    columns,
    rowCount: data?.total ?? 0,
    state: tableState, // ← from hook
    manualPagination: true,
    manualSorting: true,
    onPaginationChange, // ← from hook
    onSortingChange, // ← from hook
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataTable table={table} isLoading={isLoading} isError={isError}>
      {/* <DataTableToolbar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
      /> */}
    </DataTable>
  );
}
