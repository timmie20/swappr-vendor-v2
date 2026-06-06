import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken, getExpiresAt } from "./cookies";
import type { VendorSession } from "@/types/auth";

/**
 * Use in Server Components and Route Handlers to get the current session.
 * Returns null if unauthenticated — does NOT redirect.
 * Use requireSession() when you need to enforce auth.
 */
export async function getServerSession(): Promise<VendorSession | null> {
  const cookieStore = await cookies();
  const accessToken = getAccessToken(cookieStore);

  if (!accessToken) return null;

  try {
    const response = await fetch(`${process.env.API_BASE_URL}/vendor/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // Don't cache this — always reflects current session state
      cache: "no-store",
    });

    if (!response.ok) return null;

    const vendor = await response.json();

    return {
      id: vendor.id,
      email: vendor.email,
      businessName: vendor.business_name,
      accessToken,
      expiresAt: getExpiresAt(cookieStore) ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * Use in Server Components that require authentication.
 * Redirects to /login if no valid session exists.
 */
export async function requireSession(): Promise<VendorSession> {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return session;
}
