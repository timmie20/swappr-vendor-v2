import type { OperatingHours } from "@/schemas/onboarding";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp in ms — converted from ISO at login
}

export interface VendorSession {
  id: string;
  email: string;
  businessName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isVerified: boolean;
  logoUrl?: string;
}

export interface RefreshResponse {
  access_token: string;
  expires_at: number;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

/** Nested account owner object on /vendors/me */
export interface VendorUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email_verified?: boolean;
}

/** Response shape of the /vendor/settings/* actions */
export interface VendorSettingsResponse {
  status: boolean;
  message: string;
}

export type VerificationCheckStatus = "pending" | "verified" | "rejected";

/** Full verification record on /vendors/me — step-state display during onboarding */
export interface VendorVerifications {
  cac_status: VerificationCheckStatus | null;
  id_status: VerificationCheckStatus | null;
  cac_verified_at?: string | null;
  id_verified_at?: string | null;
  cac_rejection_reason?: string | null;
  id_rejection_reason?: string | null;
  verification_score?: number | null;
  /** Raw provider payloads (Prembly) — shape not guaranteed */
  cac_data?: Record<string, unknown> | null;
  id_data?: Record<string, unknown> | null;
}

export type VendorProfile = {
  id: string;
  user_id: string;
  user: VendorUser;
  // Written from the CAC record by verify-business; null until that step.
  // Locked after that — display/edit trading_name instead.
  business_name: string | null;
  /** Editable display name — prefer trading_name ?? business_name */
  trading_name?: string | null;
  business_address?: string | null;
  state?: string | null;
  city?: string | null;
  contact_number?: string | null;
  contact_email?: string | null;
  rc_number?: string | null;
  logo_url?: string;
  description?: string;
  is_verified: boolean;
  verification_status?: "pending" | "verified" | "rejected";
  vendor_verifications?: VendorVerifications | null;
  is_inspection_verified?: boolean;
  inspection_requested_at?: string | null;
  rating?: number;
  total_trades_completed?: number;
  onboarding_completed?: boolean;
  bank_name?: string;
  account_name?: string;
  store_photos?: string[];
  operating_hours?: OperatingHours;
  landmark?: string;
  paystack_recipient_code?: string;
  // Controls whether pickup is offered to buyers at checkout (client app).
  // Only togglable once is_inspection_verified is true — see SettingsCard.
  pickup_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  // dashboard_stats?: VendorDashboardStats;
};
