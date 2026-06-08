export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp in ms — converted from ISO at login
}

export interface VendorSession {
  id: string;
  email: string;
  businessName: string;
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

export type VendorProfile = {
  id: string;
  user_id: string;
  business_name: string;
  business_address?: string;
  state?: string;
  city?: string;
  contact_number?: string;
  email: string;
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
  operating_hours?: string;
  landmark?: string;
  paystack_recipient_code?: string;
  created_at?: string;
  updated_at?: string;
  // dashboard_stats?: VendorDashboardStats;
};
