import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { AuthTokens, RefreshResponse } from "@/types/auth";

// Vendor-scoped names — the client app uses swappr_client_* so the two
// apps never clobber each other's session (same host in dev, shared
// .swappr.com.ng domain in prod)
const COOKIE_NAMES = {
  ACCESS_TOKEN: "swappr_vendor_access",
  REFRESH_TOKEN: "swappr_vendor_refresh",
  EXPIRES_AT: "swappr_vendor_expires_at",
} as const;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax",
  path: "/",
  ...(IS_PRODUCTION && { domain: ".swappr.com.ng" }),
} as const;

// Access token lifetime — matches backend (50 minutes)
const ACCESS_TOKEN_MAX_AGE = 60 * 50;

// ─── Setters (used in Route Handlers after login / refresh) ───────────────
export function setAuthCookies(
  cookieStore: ResponseCookies | ReadonlyRequestCookies,
  tokens: AuthTokens,
): void {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, tokens.refresh_token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });

  // Readable by client JS (session-client) — same attributes as the tokens
  // so it follows them across subdomains, just not HttpOnly
  cookieStore.set(COOKIE_NAMES.EXPIRES_AT, String(tokens.expires_at), {
    ...BASE_COOKIE_OPTIONS,
    httpOnly: false,
    maxAge: ACCESS_TOKEN_MAX_AGE, // must match access token
  });
}

export function updateAccessTokenCookie(
  cookieStore: ResponseCookies | ReadonlyRequestCookies,
  tokens: RefreshResponse,
) {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(COOKIE_NAMES.EXPIRES_AT, String(tokens.expires_at), {
    ...BASE_COOKIE_OPTIONS,
    httpOnly: false,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

// Deletion only matches a cookie whose domain/path attributes match the ones
// it was set with, so reuse BASE_COOKIE_OPTIONS here
export function clearAuthCookies(
  cookieStore: ResponseCookies | ReadonlyRequestCookies,
): void {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, "", {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 0,
  });
  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, "", {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 0,
  });
  cookieStore.set(COOKIE_NAMES.EXPIRES_AT, "", {
    ...BASE_COOKIE_OPTIONS,
    httpOnly: false,
    maxAge: 0,
  });
}

// ─── Getters ──────────────────────────────────────────────────────────────────
// Accept the already-awaited cookie store — callers must await cookies() first

export function getAccessToken(
  cookieStore: ReadonlyRequestCookies,
): string | undefined {
  return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

export function getRefreshToken(
  cookieStore: ReadonlyRequestCookies,
): string | undefined {
  return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

export function getExpiresAt(
  cookieStore: ReadonlyRequestCookies,
): number | null {
  const raw = cookieStore.get(COOKIE_NAMES.EXPIRES_AT)?.value;
  if (!raw) return null;
  const parsed = Number(raw);
  return isNaN(parsed) ? null : parsed;
}

export function isTokenExpired(
  cookieStore: ReadonlyRequestCookies,
  bufferMs = 60_000,
): boolean {
  const expiresAt = getExpiresAt(cookieStore);
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - bufferMs;
}

export { COOKIE_NAMES };
