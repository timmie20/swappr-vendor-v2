import { VendorOverviewSummary } from "@/features/overview/types";
import { api } from "@/lib/api/client";

export const overviewEndpoint = {
  async getSummary(): Promise<VendorOverviewSummary> {
    const { data } = await api.get("/vendor/overview/summary");
    return data;
  },
};
