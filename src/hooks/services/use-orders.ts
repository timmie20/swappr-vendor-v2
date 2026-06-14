import { orderQueryKeys } from "@/features/orders/query-keys";
import {
  OrderDetails,
  OrderQueryParams,
  PaginatedOrders,
} from "@/features/orders/types";
import { orderEndpoint } from "@/services/orders";
import { ApiResponse } from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

// type UpdateOrderStatusPayload = {
//   id: string;
//   status: OrderStatus;
//   cancellation_reason?: string;
//   tracking_number?: string;
//   swap_device_assessed_value?: number;
// };

export function useOrders(params: OrderQueryParams) {
  return useQuery({
    queryKey: orderQueryKeys.list(params),
    queryFn: () => orderEndpoint.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrderDetails(number: string) {
  return useQuery({
    queryKey: orderQueryKeys.detail(number),
    queryFn: () => orderEndpoint.getById(number),
    enabled: !!number,
  });
}

// export function useUpdateOrderStatus() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (payload: UpdateOrderStatusPayload) => {
//       return await orderEndpoint.updateStatus(payload.id, {
//         status: payload.status,
//         cancellation_reason: payload.cancellation_reason,
//         tracking_number: payload.tracking_number,
//         swap_device_assessed_value: payload.swap_device_assessed_value,
//       });
//     },
//     onSuccess: (_data, variables) => {
//       toast.success("Order status updated successfully.", {
//         position: "top-center",
//       });
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
//     },
//     onError: (error: any) => {
//       const message =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Failed to update order status.";
//       toast.error(message, { position: "top-center" });
//     },
//   });
// }
