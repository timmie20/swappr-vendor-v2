import { redirect } from "next/navigation";
import { getOnboardingStatus } from "@/lib/onboarding/server";

// Landing point for "resume onboarding" — sends the vendor straight to
// whichever step the backend says is next
export default async function OnboardingIndexPage() {
  const { next_action } = await getOnboardingStatus();

  if (next_action === "dashboard") redirect("/overview");
  redirect(`/onboarding/${next_action}`);
}
