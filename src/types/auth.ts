export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: number; // Unix timestamp in ms
}

export interface VendorSession {
  id: string;
  email: string;
  businessName: string;
  accessToken: string;
  expiresAt: number;
}

export interface RefreshResponse {
  access_token: string;
  expires_at: number;
}
