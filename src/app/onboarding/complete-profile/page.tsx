// app/(vendor)/onboarding/complete-profile/page.tsx
import { requireOnboardingStep } from "@/lib/onboarding/server";
import { ONBOARDING_STEPS } from "@/features/onboarding/config";
import { CompleteProfileForm } from "@/features/onboarding/components/complete-profile-form";

const step = ONBOARDING_STEPS.find((s) => s.action === "complete-profile")!;

export default async function CompleteProfilePage() {
  await requireOnboardingStep("complete-profile");

  return (
    <div>
      <h1 className="text-foreground text-xl font-semibold">{step.title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
      <div className="mt-8">
        <CompleteProfileForm />
      </div>
    </div>
  );
}
