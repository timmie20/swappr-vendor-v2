import { NextAction, OnboardingStep } from "@/types/onboarding";

export const STEP_ORDER: OnboardingStep[] = [
  "account_created",
  "business_verified",
  "id_verified",
  "profile_completed",
  "approved",
];

interface StepConfig {
  action: NextAction;
  /** onboarding_step value reached once this step is submitted successfully */
  completesAt: OnboardingStep;
  title: string;
  description: string;
}

export const ONBOARDING_STEPS: StepConfig[] = [
  {
    action: "verify-business",
    completesAt: "business_verified",
    title: "Verify your business",
    description:
      "Confirm your CAC registration so customers know you're a real business.",
  },
  {
    action: "verify-id",
    completesAt: "id_verified",
    title: "Verify your identity",
    description: "Confirm the ID linked to your account with your BVN or NIN.",
  },
  {
    action: "complete-profile",
    completesAt: "profile_completed",
    title: "Review your details",
    description:
      "Confirm the details we pulled from your CAC record, then add the store details customers will see. You can always edit these later.",
  },
];

export type StepStatus = "completed" | "current" | "upcoming";

export function getStepStatus(
  onboardingStep: OnboardingStep,
  completesAt: OnboardingStep,
): StepStatus {
  const currentIndex = STEP_ORDER.indexOf(onboardingStep);
  const completesAtIndex = STEP_ORDER.indexOf(completesAt);

  if (currentIndex >= completesAtIndex) return "completed";
  if (currentIndex === completesAtIndex - 1) return "current";
  return "upcoming";
}
