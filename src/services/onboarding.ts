import { api } from "@/lib/api/client";
import {
  CompleteProfilePayload,
  VerifyBusinessInput,
  VerifyIdInput,
} from "@/schemas/onboarding";
import { OnboardingMutationResponse } from "@/types/onboarding";

export const onboardingEndpoints = {
  async verifyBusiness(
    input: VerifyBusinessInput,
  ): Promise<OnboardingMutationResponse> {
    const { data } = await api.post<OnboardingMutationResponse>(
      "/vendor/onboarding/verify-business",
      input,
    );
    return data;
  },

  async verifyBvn(input: VerifyIdInput): Promise<OnboardingMutationResponse> {
    const { data } = await api.post<OnboardingMutationResponse>(
      "/vendor/onboarding/verify-bvn",
      input,
    );
    return data;
  },

  async verifyNin(input: VerifyIdInput): Promise<OnboardingMutationResponse> {
    const { data } = await api.post<OnboardingMutationResponse>(
      "/vendor/onboarding/verify-nin",
      input,
    );
    return data;
  },

  async completeProfile(
    input: CompleteProfilePayload,
  ): Promise<OnboardingMutationResponse> {
    const { data } = await api.post<OnboardingMutationResponse>(
      "/vendor/onboarding/complete-profile",
      input,
    );
    return data;
  },
};
