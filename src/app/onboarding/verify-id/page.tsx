import { requireOnboardingStep } from "@/lib/onboarding/server";
import { ONBOARDING_STEPS } from "@/features/onboarding/config";
import { VerifyIdForm } from "@/features/onboarding/components/verify-id-form";

const step = ONBOARDING_STEPS.find((s) => s.action === "verify-id")!;

export default async function VerifyIdPage() {
  await requireOnboardingStep("verify-id");

  return (
    <div>
      <h1 className="text-foreground text-xl font-semibold">{step.title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
      <div className="mt-8">
        <VerifyIdForm />
      </div>
    </div>
  );
}
