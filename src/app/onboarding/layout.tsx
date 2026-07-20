import type { ReactNode } from "react";
import { getOnboardingStatus } from "@/lib/onboarding/server";
import { requireSession } from "@/lib/auth/session";
import { OnboardingStepper } from "@/features/onboarding/components/stepper";
import Image from "next/image";
import { ASSETS } from "@/constants/assets";
import { LogoutButton } from "@/components/shared/logout-button";
import { OnboardingFlagSync } from "@/components/shared/onboarding-flag-sync";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSession();
  const { onboarding_step } = await getOnboardingStatus();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center justify-between font-medium">
          <Image
            src={ASSETS.LOGO_LIGHT}
            alt="Swappr"
            width={200}
            height={40}
            priority
            className="h-10 w-auto cursor-pointer"
          />
        </div>

        <div className="z-50 items-center lg:flex lg:h-full lg:flex-col lg:justify-center">
          <OnboardingStepper currentStep={onboarding_step} />
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Almost there. A few quick checks — business and ID verification —
              and your storefront goes live. This keeps every vendor on Swappr
              accountable, so buyers trust what they see and you close more
              sales.
            </p>
            <footer className="text-sm">Cheers 🍻</footer>
          </blockquote>
        </div>
      </div>

      {/* Vertical centering via my-auto (not items-center) — auto margins
          collapse when the form is taller than the viewport, so the top
          stays scrollable instead of being clipped */}
      <main className="relative flex justify-center px-6 py-10 sm:px-10 lg:h-screen lg:overflow-y-auto lg:py-16">
        <LogoutButton className="text-muted-foreground absolute top-4 right-4" />
        <div className="w-full max-w-md lg:my-auto">{children}</div>
      </main>

      <OnboardingFlagSync complete={false} />
    </div>
  );
}
