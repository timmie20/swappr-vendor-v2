"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/helpers/get-error-message";
import { OnboardingMutationResponse } from "@/types/onboarding";
import { onboardingEndpoints } from "@/services/onboarding";

function useOnboardingMutation<TInput>(
  mutationFn: (input: TInput) => Promise<OnboardingMutationResponse>,
) {
  const router = useRouter();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      const destination =
        data.next_action === "dashboard"
          ? "/overview"
          : `/onboarding/${data.next_action}`;
      router.push(destination);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
      console.error("Onboarding mutation error:", error);
    },
  });
}

export function useVerifyBusiness() {
  return useOnboardingMutation(onboardingEndpoints.verifyBusiness);
}

export function useVerifyBvn() {
  return useOnboardingMutation(onboardingEndpoints.verifyBvn);
}

export function useVerifyNin() {
  return useOnboardingMutation(onboardingEndpoints.verifyNin);
}

export function useCompleteProfile() {
  return useOnboardingMutation(onboardingEndpoints.completeProfile);
}
