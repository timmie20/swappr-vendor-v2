import Typography from "@/components/ui/typography";
import React from "react";
import InventoryTable from "./component/inventory-table";
import { getQueryClient } from "@/lib/query/prefetch";
import { productQueryKeys } from "./query-keys";
import { fetchProducts } from "@/server-actions/product";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchCategories } from "@/server-actions/categories";
import { categoriesQueryKeys } from "@/hooks/services/use-categories";
import { defaultQueryParams } from "@/constants/query";

export default async function InventoryPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.list(defaultQueryParams),
    queryFn: () => fetchProducts(),
  });

  await queryClient.prefetchQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: () => fetchCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
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
