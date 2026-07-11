"use client";

import { useEffect } from "react";
import { setOnboardingCompleteFlag } from "@/lib/onboarding/client-flag";

/** Renders nothing — keeps the local onboarding-complete hint in sync with
 *  what the server layout that rendered it already verified. */
export function OnboardingFlagSync({ complete }: { complete: boolean }) {
  useEffect(() => {
    setOnboardingCompleteFlag(complete);
  }, [complete]);

  return null;
}
