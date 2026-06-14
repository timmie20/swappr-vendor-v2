import {
  PaginatedProducts,
  ProductQueryParams,
} from "@/features/inventory/types";
import { OrderDetails } from "@/features/orders/types";
import { serverFetch } from "@/lib/api/server";
import { ApiResponse } from "@/types";

export async function fetchProducts(
  params?: ProductQueryParams,
): Promise<PaginatedProducts> {
  const res = await serverFetch<PaginatedProducts>("/vendors/me/products", {
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

export async function fetchOrderDetails(
  number: string,
): Promise<ApiResponse<OrderDetails>> {
  const res = await serverFetch<ApiResponse<OrderDetails>>(`/orders/${number}`);
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
