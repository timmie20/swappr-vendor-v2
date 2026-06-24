import { cache } from "react";
import { serverFetch } from "../api/server";
import { NextAction, OnboardingStatus } from "@/types/onboarding";
import { redirect } from "next/navigation";

export const getOnboardingStatus = cache(
  async (): Promise<OnboardingStatus> => {
    return serverFetch<OnboardingStatus>("/vendor/onboarding/status", {
      revalidate: 0,
    });
  },
);

/** Use on each onboarding step page. Redirects to /dashboard if already
 *  approved, or to the correct step if the vendor is on the wrong one. */
export async function requireOnboardingStep(currentAction: NextAction) {
  const status = await getOnboardingStatus();

  if (status.next_action === "dashboard") redirect("/dashboard");
  if (status.next_action !== currentAction) {
    redirect(`/onboarding/${status.next_action}`);
  }

  return status;
}

/** Use in the dashboard layout. Redirects back into onboarding
 *  if it isn't complete yet. */
export async function requireOnboardingComplete() {
  const status = await getOnboardingStatus();

  if (status.next_action !== "dashboard") {
    redirect(`/onboarding/${status.next_action}`);
  }

  return status;
}
