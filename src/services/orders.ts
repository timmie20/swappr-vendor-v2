import {
  OrderDetails,
  OrderQueryParams,
  PaginatedOrders,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
} from "@/features/orders/types";
import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types";

export const orderEndpoint = {
  async getAll(params?: OrderQueryParams): Promise<PaginatedOrders> {
    const { data } = await api.get("/orders/vendor", { params });
    return data;
  },

  async getById(id: string): Promise<ApiResponse<OrderDetails>> {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  async updateStatus(
    id: string,
    payload: UpdateOrderStatusPayload,
  ): Promise<UpdateOrderStatusResponse> {
    const { data } = await api.patch(`/orders/${id}/status`, payload);
    return data;
  },
};
