import type { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { AuthTokens, RefreshResponse } from "@/types/auth";

const COOKIE_NAMES = {
  ACCESS_TOKEN: "swappr_access",
  REFRESH_TOKEN: "swappr_refresh_token",
  EXPIRES_AT: "swappr_expires_at",
} as const;

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ─── Setters (used in Route Handlers after login / refresh) ───────────────
export function setAuthCookies(
  cookieStore: ResponseCookies | ReadonlyRequestCookies,
  tokens: AuthTokens,
): void {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 60 * 15, // 15 minutes
  });

  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, tokens.refresh_token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set(COOKIE_NAMES.EXPIRES_AT, String(tokens.expires_at), {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: "strict" as const,
    path: "/",
    maxAge: 60 * 15,
  });

  console.log(
    cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN),
    cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN),
  );
}

export function updateAccessTokenCookie(
  cookieStore: ResponseCookies | ReadonlyRequestCookies,
  tokens: RefreshResponse,
) {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 60 * 15,
  });

  cookieStore.set(COOKIE_NAMES.EXPIRES_AT, String(tokens.expires_at), {
    httpOnly: false,
    secure: IS_PRODUCTION,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });
}

export function clearAuthCookies(
  cookieStore: ResponseCookies | ReadonlyRequestCookies,
): void {
  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, "", { maxAge: 0, path: "/" });
  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, "", {
    maxAge: 0,
    path: "/api/auth/refresh",
  });
  cookieStore.set(COOKIE_NAMES.EXPIRES_AT, "", { maxAge: 0, path: "/" });
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
