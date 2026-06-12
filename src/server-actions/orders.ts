// import { PaginatedOrdersSchema } from "./schemas";

import { OrderQueryParams, PaginatedOrders } from "@/features/orders/types";
import { serverFetch } from "@/lib/api/server";

export async function fetchOrders(
  params?: OrderQueryParams,
): Promise<PaginatedOrders> {
  // const searchParams = new URLSearchParams();

  // searchParams.set("page", String(params.page));
  // searchParams.set("limit", String(params.limit));

  // if (params.sort_by)    searchParams.set("sort_by", params.sort_by);
  // if (params.sort_order) searchParams.set("sort_order", params.sort_order);
  // if (params.q)          searchParams.set("q", params.q);
  // if (params.status)     searchParams.set("status", params.status);

  // const response = await apiClient(`/orders?${searchParams.toString()}`);

  // Validate the response shape at the API boundary.
  // If the backend changes its response shape, this throws
  // immediately with a clear error rather than a silent runtime bug.

  const res = await serverFetch<PaginatedOrders>("/vendor/orders", {
    params: params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null) // strip undefined/null
            .map(([k, v]) => [k, String(v)]), // coerce all values to string
        )
      : undefined,
  });
  return res;
}

// export async function updateOrderStatus(
//   orderId: string,
//   payload: UpdateOrderStatusPayload,
// ): Promise<Order> {
//   return apiClient(`/orders/${orderId}/status`, {
//     method: "PATCH",
//     body: JSON.stringify(payload),
//   });
// }
