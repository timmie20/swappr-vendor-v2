import { redirect } from "next/navigation";
import type { VendorProfile, VendorSession } from "@/types/auth";
import { cache } from "react";
import { serverFetch } from "../api/server";

export const getServerSession = cache(
  async (): Promise<VendorSession | null> => {
    try {
      const vendor = await serverFetch<VendorProfile>("/vendors/me");

      return {
        id: vendor.id,
        email: vendor.user?.email,
        isVerified: vendor.is_verified,
        businessName: vendor.business_name,
        firstName: vendor.user?.first_name,
        lastName: vendor.user?.last_name,
        avatarUrl: vendor.user?.avatar_url,
        logoUrl: vendor.logo_url,
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
