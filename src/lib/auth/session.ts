import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken, getExpiresAt } from "./cookies";
import type { VendorProfile, VendorSession } from "@/types/auth";
import { serverApi } from "../api/server";
import { cache } from "react";

/**
 * Use in Server Components and Route Handlers to get the current session.
 * Returns null if unauthenticated — does NOT redirect.
 * Use requireSession() when you need to enforce auth.
 */
export const getServerSession = cache(
  async (): Promise<VendorSession | null> => {
    const cookieStore = await cookies();
    const accessToken = getAccessToken(cookieStore);

    if (!accessToken) return null;

    try {
      const { data: vendor } = await serverApi.get<VendorProfile>(
        "/vendors/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return {
        id: vendor.id,
        email: vendor.email,
        isVerified: vendor.is_verified,
        businessName: vendor.business_name,
        logoUrl: vendor.logo_url,
        // expiresAt: getExpiresAt(cookieStore) ?? 0,
      };
    } catch {
      return null;
    }
  },
);

/**
 * Use in Server Components that require authentication.
 * Redirects to /login if no valid session exists.
 */
export async function requireSession(): Promise<VendorSession> {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return session;
}
