import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/prefetch";
import Typography from "@/components/ui/typography";
import { OrdersTable } from "./components/order-table";
import { orderQueryKeys } from "./query-keys";
import { fetchOrders } from "@/server-actions/orders";
import { defaultQueryParams } from "@/constants/query";

export default async function OrdersPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: orderQueryKeys.list(defaultQueryParams),
    queryFn: () => fetchOrders(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <Typography variant="h2" className="text-left">
          Manage Orders
        </Typography>
        <OrdersTable />
      </div>
    </HydrationBoundary>
  );
}
