import { redirect } from "next/navigation";
import type { VendorProfile, VendorSession } from "@/types/auth";
import { cache } from "react";
import { serverFetch } from "../api/server";

/**
 * Full vendor profile, server-side. Separate from getServerSession — pages
 * like the onboarding review screen need fields (Prembly prefills, trading
 * name) the session shape deliberately doesn't carry.
 *
 * revalidate: 0 for the same reason as getOnboardingStatus — the vendor may
 * have just populated these fields via verification; stale data would render
 * blank inputs where prefills are expected.
 */
export const getServerVendorProfile = cache(
  async (): Promise<VendorProfile> => {
    return serverFetch<VendorProfile>("/vendors/me", { revalidate: 0 });
  },
);

export const getServerSession = cache(
  async (): Promise<VendorSession | null> => {
    try {
      const vendor = await getServerVendorProfile();

      return {
        id: vendor.id,
        email: vendor.user?.email,
        isVerified: vendor.is_verified,
        // Both are null until their onboarding stage completes
        businessName: vendor.trading_name ?? vendor.business_name ?? "",
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
