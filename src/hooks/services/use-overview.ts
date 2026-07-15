import { defaultQueryParams } from "@/constants/query";
import { notificationQueryKeys } from "@/features/notifications/query-keys";
import { NotificationQueryParams } from "@/features/notifications/types";
import { orderQueryKeys } from "@/features/orders/query-keys";
import { OrderQueryParams } from "@/features/orders/types";
import { overviewQueryKeys } from "@/features/overview/query-keys";
import { notificationEndpoint } from "@/services/notifications";
import { orderEndpoint } from "@/services/orders";
import { overviewEndpoint } from "@/services/overview";
import { useQuery } from "@tanstack/react-query";

export function useVendorOverviewSummary() {
  return useQuery({
    queryKey: overviewQueryKeys.summary(),
    queryFn: () => overviewEndpoint.getSummary(),
    // Aggregates don't need to be live — a minute of staleness is fine
    staleTime: 60_000,
    // The app disables focus refetch globally, but the overview is a
    // "glance at my store" page — coming back to the tab should refresh
    // it (staleTime still throttles how often that actually fires)
    refetchOnWindowFocus: true,
  });
}

// defaultQueryParams already sorts created_at DESC, i.e. most recent first.
// The smaller limit keeps this cache entry distinct from the orders page's
// list, while orderQueryKeys keeps it inside the namespace the order-status
// mutations invalidate.
const recentOrdersParams: OrderQueryParams = {
  ...defaultQueryParams,
  limit: 5,
};

export function useRecentOrders() {
  return useQuery({
    queryKey: orderQueryKeys.list(recentOrdersParams),
    queryFn: () => orderEndpoint.getAll(recentOrdersParams),
    staleTime: 15_000, // orders move faster than the aggregates above
    refetchOnWindowFocus: true,
  });
}

const recentActivityParams: NotificationQueryParams = { page: 1, limit: 3 };

export function useRecentActivity() {
  return useQuery({
    // Keyed under notificationQueryKeys so the mark-read mutations' cache
    // patches (setQueriesData on lists()) reach this feed too
    queryKey: notificationQueryKeys.list(recentActivityParams),
    queryFn: () => notificationEndpoint.getAll(recentActivityParams),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}
