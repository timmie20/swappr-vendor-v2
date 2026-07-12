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

export type VendorProfile = {
  id: string;
  user_id: string;
  user: VendorUser;
  business_name: string;
  business_address?: string;
  state?: string;
  city?: string;
  contact_number?: string;
  logo_url?: string;
  description?: string;
  is_verified: boolean;
  verification_status?: "pending" | "verified" | "rejected";
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
  // Settings UI to manage this is out of scope for now — field only.
  pickup_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  // dashboard_stats?: VendorDashboardStats;
};
