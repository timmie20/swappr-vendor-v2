import { type Table } from "@tanstack/react-table";
import { DataTableBulkActionBar } from "@/components/table/data-table-bulk-action-bar";
// import {
//   useBulkDeleteProducts,
//   useBulkToggleProductPublish,
// } from "../mutations";
import type { Product } from "../types";
import { Icons } from "@/components/shared/icons";
import {
  useBulkDeleteProducts,
  useBulkToggleProductPublish,
} from "@/hooks/services/use-products";

interface InventoryBulkActionBarProps {
  table: Table<Product>;
}

export function InventoryBulkActionBar({ table }: InventoryBulkActionBarProps) {
  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteProducts();
  const { mutate: bulkToggle, isPending: isToggling } =
    useBulkToggleProductPublish();

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const selectedIds = selectedRows
    .map((row) => row.original.id)
    .filter((id): id is string => id !== undefined);

  const actions = [
    {
      label: "Unpublish",
      icon: <Icons.eyeOff className="size-3.5" />,
      isPending: isToggling,
      onClick: () =>
        bulkToggle(
          { ids: selectedIds, is_active: false },
          { onSuccess: () => table.resetRowSelection() },
        ),
    },
    {
      label: "Publish",
      icon: <Icons.eye className="size-3.5" />,
      isPending: isToggling,
      variant: "default" as const,
      onClick: () =>
        bulkToggle(
          { ids: selectedIds, is_active: true },
          { onSuccess: () => table.resetRowSelection() },
        ),
    },
    {
      label: "Delete",
      icon: <Icons.trash className="size-3.5" />,
      variant: "destructive" as const,
      isPending: isDeleting,
      onClick: () =>
        bulkDelete(
          { ids: selectedIds },
          { onSuccess: () => table.resetRowSelection() },
        ),
    },
  ];

  return (
    <DataTableBulkActionBar
      selectedCount={selectedRows.length}
      actions={actions}
      onClearSelection={() => table.resetRowSelection()}
    />
  );
}
