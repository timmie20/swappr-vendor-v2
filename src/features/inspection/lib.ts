import type { VendorProfile } from "@/types/auth";

export type InspectionState = "not_requested" | "pending" | "verified";

/** Derives the settings-screen state from the /vendors/me inspection fields */
export function getInspectionState(
  profile: Pick<
    VendorProfile,
    "is_inspection_verified" | "inspection_requested_at"
  >,
): InspectionState {
  if (profile.is_inspection_verified) return "verified";
  if (profile.inspection_requested_at) return "pending";
  return "not_requested";
}

// Namespaced per vendor — two vendors sharing a browser (shared-computer
// Computer Village scenario) must not hide each other's banner
export const inspectionBannerDismissKey = (vendorId: string) =>
  `swappr_hide_inspection_banner_${vendorId}`;
