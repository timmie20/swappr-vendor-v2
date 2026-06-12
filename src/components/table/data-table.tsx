import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type * as React from "react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableSkeleton } from "./data-table-skeleton";
import Image from "next/image";
import { ASSETS } from "@/constants/assets";
import { Icons } from "../shared/icons";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;

  /**
   * Bulk action bar — only rendered when rows are selected.
   * Renders above the scroll area.
   */
  actionBar?: React.ReactNode;

  /**
   * Pass `true` while your query's `isFetching` is true.
   * Falls back to an auto-derived DataTableSkeleton when no
   * `loadingState` override is provided.
   */
  isLoading?: boolean;

  isFetching?: boolean;

  /**
   * Pass `true` when your query is in an error state.
   */
  isError?: boolean;

  /**
   * Override the default skeleton. Useful when a resource needs
   * different cell widths or filter counts in its loading state.
   */
  loadingState?: React.ReactNode;

  /**
   * Shown when the query errored. Defaults to a simple message.
   */
  errorState?: React.ReactNode;

  /**
   * Shown when the query succeeded but returned zero rows.
   * Defaults to "No results."
   */
  emptyState?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  actionBar,
  isLoading = false,
  isFetching = false,
  isError = false,
  loadingState,
  errorState,
  emptyState,
  children,
}: DataTableProps<TData>) {
  const hasSelectedRows = table.getFilteredSelectedRowModel().rows.length > 0;

  const columnCount = table.getAllColumns().length;
  const pageSize = table.getState().pagination.pageSize;

  const defaultLoadingState = (
    <DataTableSkeleton
      columnCount={columnCount}
      rowCount={pageSize}
      withViewOptions={false}
      withPagination={false}
    />
  );

  const defaultErrorState = (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className="text-muted-foreground h-24 text-center"
      >
        <div className="mb-2">
          <Image
            src={ASSETS.ERROR_STATE}
            alt="Error state"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <span className="">Something went wrong.</span>
        <br />
        Please try again.
      </TableCell>
    </TableRow>
  );

  const defaultEmptyState = (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className="text-muted-foreground h-24 text-center"
      >
        <div className="mb-2">
          <Image
            src={ASSETS.EMPTY_STATE}
            alt="Empty state"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>
        <span className="">No results.</span>
      </TableCell>
    </TableRow>
  );

  function renderBody() {
    if (isLoading) {
      // Skeleton renders outside the Table — replace the whole scroll area
      return null;
    }

    if (isError) {
      return errorState ?? defaultErrorState;
    }

    if (!table.getRowModel().rows?.length) {
      return emptyState ?? defaultEmptyState;
    }

    return table.getRowModel().rows.map((row) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      {children}

      {actionBar && hasSelectedRows && actionBar}

      {isLoading ? (
        <div className="flex flex-1 flex-col">
          {loadingState ?? defaultLoadingState}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border">
          {isFetching && (
            <div className="bg-background/50 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
              <Icons.spinner className="text-muted-foreground animate-spin" />
            </div>
          )}
          <ScrollArea className="h-full w-full">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>{renderBody()}</TableBody>
            </Table>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      <div className="shrink-0">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
