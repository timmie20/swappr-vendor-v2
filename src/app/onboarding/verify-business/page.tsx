import { requireOnboardingStep } from "@/lib/onboarding/server";
import { ONBOARDING_STEPS } from "@/features/onboarding/config";
import { VerifyBusinessForm } from "@/features/onboarding/components/verify-business-form";

const step = ONBOARDING_STEPS.find((s) => s.action === "verify-business")!;

export default async function VerifyBusinessPage() {
  await requireOnboardingStep("verify-business");

  return (
    <div>
      <h1 className="text-foreground text-xl font-semibold">{step.title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
      <div className="mt-8">
        <VerifyBusinessForm />
      </div>
    </div>
  );
}
