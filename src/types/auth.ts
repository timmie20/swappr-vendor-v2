export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp in ms — converted from ISO at login
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
