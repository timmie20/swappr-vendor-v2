import {
  PaginatedPayouts,
  PayoutQueryParams,
  PayoutSummary,
} from "@/features/payouts/types";
import { api } from "@/lib/api/client";

export const payoutEndpoints = {
  async getAll(params?: PayoutQueryParams): Promise<PaginatedPayouts> {
    const { data } = await api.get("/payments/payouts", {
      params,
    });
    return data;
  },

  async getSummary(): Promise<PayoutSummary> {
    const { data } = await api.get("/payments/payouts/summary");
    return data;
  },
};
