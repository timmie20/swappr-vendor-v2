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
import { useCategories } from "@/hooks/services/use-categories";
import { formatToOptions } from "@/helpers/format";
import { InventoryBulkActionBar } from "./inventory-bulk-action";
import { Button } from "@/components/ui/button";
import ResubaleSheet from "@/components/resuable-sheet";
import AddProductForm from "./product-form";
import { Icons } from "@/components/shared/icons";

// Static — no data dependency, safe outside the component
const STATUS_FILTER_OPTIONS = Object.values(ProductStatus).map((status) => ({
  label: status.charAt(0).toUpperCase() + status.slice(1),
  value: status,
}));

export default function InventoryTable() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);

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
  } = useFilterState({ status: "", category_ids: "" });

  const { data, isLoading, isError, isFetching } = useProducts({
    ...queryParams,
    ...(activeFilters as Partial<ProductQueryParams>),
  });

  // Cache is already warm from server prefetch — no loading state needed here
  const { data: categoriesData } = useCategories();

  // Derived from async data — must live inside the component
  const categoryFilterOptions = useMemo(
    () => formatToOptions(categoriesData?.categories ?? [], ["id", "name"]),
    [categoriesData?.categories],
  );

  // Rebuilt when categoryFilterOptions resolves, stable otherwise
  const PRODUCT_FILTERS: FilterConfig[] = useMemo(
    () => [
      {
        type: "select",
        key: "status",
        label: "Status",
        options: STATUS_FILTER_OPTIONS,
      },
      {
        type: "multi-select",
        key: "category_ids",
        label: "Category",
        options: categoryFilterOptions,
      },
    ],
    [categoryFilterOptions],
  );

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
    <>
      <div className="flex items-center justify-end">
        <ResubaleSheet
          title="Add New Product"
          description="Fill in the details to add a new product to your inventory."
          trigger={
            <Button className="cursor-pointer">
              <Icons.add />
              Add Product
            </Button>
          }
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
        >
          <AddProductForm onSuccessAction={() => setIsFormOpen(false)} />
        </ResubaleSheet>
      </div>
      <DataTable
        table={table}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        actionBar={<InventoryBulkActionBar table={table} />}
      >
        <DataTableToolbar
          searchPlaceholder="Search products"
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          filters={PRODUCT_FILTERS}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </DataTable>
    </>
  );
}
