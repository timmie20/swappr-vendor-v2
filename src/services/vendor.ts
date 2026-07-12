import { api } from "@/lib/api/client";
import type { VendorProfile } from "@/types/auth";
import type { UpdateVendorProfilePayload } from "@/schemas/vendor";

export const vendorEndpoints = {
  async getMe(): Promise<VendorProfile> {
    const { data } = await api.get<VendorProfile>("/vendors/me");
    return data;
  },

  async updateMe(payload: UpdateVendorProfilePayload): Promise<VendorProfile> {
    const { data } = await api.patch<VendorProfile>("/vendors/me", payload);
    return data;
  },
};
