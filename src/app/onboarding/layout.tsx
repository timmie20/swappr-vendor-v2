import type { ReactNode } from "react";
import { getOnboardingStatus } from "@/lib/onboarding/server";
import { requireSession } from "@/lib/auth/session";
import { OnboardingStepper } from "@/features/onboarding/components/stepper";
import Image from "next/image";
import { ASSETS } from "@/constants/assets";
import { Button } from "@/components/ui/button";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSession();
  const { onboarding_step } = await getOnboardingStatus();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* <aside className="border-border bg-muted/30 border-b px-6 py-6 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0 lg:px-16 lg:py-16">
        <div className="relative z-20 flex items-center font-medium">
          <Image
            src={ASSETS.LOGO_DARK}
            alt="Swappr"
            width={200}
            height={40}
            priority
            className="h-10 w-auto cursor-pointer"
          />
        </div>
      </aside> */}

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
              Swappr platform aims to create a secure and transparent system for
              buying and swapping phones by implementing a phone rating
              calculator to accurately represent device conditions, addressing
              prevalent fraud in the Nigerian market. The system will utilize
              diagnostic tools, user verification through KYC, and AI-driven
              fraud prevention in future updates.
            </p>
            <footer className="text-sm">Cheers 🍻</footer>
          </blockquote>
        </div>
      </div>

      <main className="flex justify-center px-6 py-10 sm:px-10 lg:h-screen lg:items-center lg:overflow-y-auto lg:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
