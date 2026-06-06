import { NextRequest, NextResponse } from "next/server";
import {
  clearAuthCookies,
  COOKIE_NAMES,
  setAuthCookies,
} from "./lib/auth/cookies";
import { AuthTokens } from "./types/auth";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

// Routes that authenticated users shouldn't access (redirect to dashboard)
const AUTH_ROUTES = ["/login", "/register"];

function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function getTokensFromRequest(request: NextRequest) {
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  const expiresAtRaw = request.cookies.get(COOKIE_NAMES.EXPIRES_AT)?.value;
  const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : null;

  return { accessToken, refreshToken, expiresAt };
}

function isExpired(expiresAt: number | null, bufferMs = 60_000): boolean {
  if (!expiresAt || isNaN(expiresAt)) return true;
  return Date.now() >= expiresAt - bufferMs;
}

async function attemptRefresh(
  refreshToken: string,
): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();

    // Validate shape — don't trust external data blindly
    if (
      !data.access_token ||
      !data.refresh_token ||
      !data.access_token_expires_at
    ) {
      return null;
    }
    return data as AuthTokens;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { accessToken, refreshToken, expiresAt } =
    getTokensFromRequest(request);

  const hasSession = !!accessToken;
  const sessionExpired = isExpired(expiresAt);

  // ── 1. Authenticated user hitting a login/register page ───────────────
  // Redirect them to the dashboard — they're already in
  if (hasSession && !sessionExpired && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // ── 2. Public route — let it through unconditionally ──────────────────
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ── 3. No session at all — redirect to login ──────────────────────────
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Session exists but token is expired — attempt silent refresh ───
  if (sessionExpired) {
    if (!refreshToken) {
      // No refresh token available — full logout
      const response = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(response.cookies);
      return response;
    }

    const newTokens = await attemptRefresh(refreshToken);

    if (!newTokens) {
      // Refresh failed (token revoked, expired, backend error)
      const response = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(response.cookies);
      return response;
    }

    // Refresh succeeded — update cookies and continue with original request
    const response = NextResponse.next();
    setAuthCookies(response.cookies, newTokens);
    return response;
  }

  // ── 5. Valid session — proceed ─────────────────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images).*)"],
};
