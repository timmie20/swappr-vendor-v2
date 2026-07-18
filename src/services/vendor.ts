import { api } from "@/lib/api/client";
import type { VendorProfile, VendorSettingsResponse } from "@/types/auth";
import type { UpdateVendorProfilePayload } from "@/schemas/vendor";

export const vendorEndpoints = {
  async getMe(): Promise<VendorProfile> {
    const { data } = await api.get<VendorProfile>("/vendors/me");
    return data;
  },

  async updateProfile(
    vendorId: string,
    payload: UpdateVendorProfilePayload,
  ): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>(
      `/vendors/${vendorId}/update`,
      payload,
    );
    return data;
  },

  /** Flips the vendor into the "inspection pending" state and queues ops.
   *  400 if already verified or already requested; 403 if not yet approved. */
  async requestInspection(): Promise<VendorSettingsResponse> {
    const { data } = await api.post<VendorSettingsResponse>(
      "/vendor/settings/request-inspection",
    );
    return data;
  },

  /** 403 when enabling before is_inspection_verified — the UI intercepts
   *  that case with the inspection dialog before ever calling this. */
  async togglePickup(enabled: boolean): Promise<VendorSettingsResponse> {
    const { data } = await api.patch<VendorSettingsResponse>(
      "/vendor/settings/pickup",
      { enabled },
    );
    return data;
  },
};
