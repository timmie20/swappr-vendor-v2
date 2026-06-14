import Typography from "@/components/ui/typography";
import React from "react";
import InventoryTable from "./component/inventory-table";
import { getQueryClient } from "@/lib/query/prefetch";
import { productQueryKeys } from "./query-keys";
import { fetchProducts } from "@/server-actions/product";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function InventoryPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.list({
      page: 1,
      limit: 20,
      sort_by: "created_at",
      sort_order: "DESC",
      search: "",
    }),
    queryFn: () => fetchProducts(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <Typography variant="h2" className="text-left">
          Manage Inventory
        </Typography>
        <InventoryTable />
      </div>
    </HydrationBoundary>
  );
}
