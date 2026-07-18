export const vendorQueryKeys = {
  // Matches everything vendor-profile related
  all: () => ["vendor"] as const,

  // The authenticated vendor's own profile (/vendors/me)
  profile: () => [...vendorQueryKeys.all(), "profile"] as const,
} as const;
