export type OnboardingStep =
  | "account_created"
  | "business_verified"
  | "id_verified"
  | "profile_completed"
  | "approved";

export type NextAction =
  | "verify-business"
  | "verify-id"
  | "complete-profile"
  | "pending-approval"
  | "dashboard";

export interface OnboardingStatus {
  onboarding_step: OnboardingStep;
  next_action: NextAction;
}

// Now identical to OnboardingStatus + message, since the backend
// returns the same shape on every successful mutation.
export interface OnboardingMutationResponse extends OnboardingStatus {
  message: string;
}
