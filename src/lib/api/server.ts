// lib/api/server.ts
// ⚠️ Server only — never import in a Client Component

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAMES } from "../auth/cookies";

const BASE_URL = process.env.API_BASE_URL!;

interface ServerFetchOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  params?: Record<string, string>;
  revalidate?: number | false;
  tags?: string[];
}

export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  // No caching by default — responses are per-vendor (Authorization header),
  // and Next's data cache keys on URL, so cached entries could leak between
  // vendors. Callers opt in with an explicit `revalidate` where safe.
  const { method = "GET", body, params, revalidate = 0, tags } = options;

  // Read access token from HttpOnly cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (!accessToken) redirect("/login");

  const url = new URL(`${BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    next: {
      revalidate,
      ...(tags ? { tags } : {}),
    },
  });

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${res.status}`);
  }

  return res.json();
}
