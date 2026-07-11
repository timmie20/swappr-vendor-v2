// Client-side hint of whether the vendor finished onboarding, used to route
// straight to the right place after login instead of bouncing through
// server redirects. It is only ever a hint — the server layouts remain the
// source of truth and will correct a stale value with a redirect.

const KEY = "swappr_onboarding_complete";

export function getOnboardingCompleteFlag(): boolean | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  return raw === null ? null : raw === "true";
}

export function setOnboardingCompleteFlag(value: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(value));
}
