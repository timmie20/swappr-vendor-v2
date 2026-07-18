import OrderDetailsPage from "@/features/order-details/page";
import { orderQueryKeys } from "@/features/orders/query-keys";
import { getQueryClient } from "@/lib/query/prefetch";
import { fetchOrderDetails } from "@/server-actions/orders";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: orderQueryKeys.detail(number),
    queryFn: () => fetchOrderDetails(number),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderDetailsPage orderNumber={number} />
    </HydrationBoundary>
  );
}
