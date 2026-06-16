import { productQueryKeys } from "@/features/inventory/query-keys";
import ProductDetails from "@/features/product-details/page";
import { getQueryClient } from "@/lib/query/prefetch";
import { fetchProductDetails } from "@/server-actions/product";
import { productEndpoints } from "@/services/products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => fetchProductDetails(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetails productId={id} />
    </HydrationBoundary>
  );
}
