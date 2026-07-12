import { orderQueryKeys } from "@/features/orders/query-keys";
import {
  OrderDetails,
  OrderQueryParams,
  PaginatedOrders,
  UpdateOrderStatusPayload,
} from "@/features/orders/types";
import { orderEndpoint } from "@/services/orders";
import { ApiResponse } from "@/types";
import { getErrorMessage } from "@/helpers/get-error-message";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateOrderStatusPayload) =>
      orderEndpoint.updateStatus(id, payload),
    onSuccess: ({ order }) => {
      toast.success("Order status updated successfully.");

      // The PATCH response already contains the fresh order — write it
      // straight into the detail cache so the details page updates
      // instantly instead of waiting on a background refetch.
      queryClient.setQueryData<ApiResponse<OrderDetails>>(
        orderQueryKeys.detail(order.order_number),
        { data: order },
      );
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
    },
    onError: (error) => {
      toast.error("Failed to update order status", {
        description: getErrorMessage(error),
      });
    },
  });
}
