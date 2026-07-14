"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginCredentials } from "@/types/auth";
import { authEndpoints } from "@/services/auth";
import { notify } from "@/helpers/notify";
import { getErrorMessage } from "@/helpers/get-error-message";

export const userKeys = {
  all: ["user"] as const,
  detail: () => [...userKeys.all, "detail"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cred: LoginCredentials) => authEndpoints.login(cred),

    onSuccess: async () => {
      notify.success("Successfully signed in");
      // Wipe everything, not just user keys — a previous vendor's session may
      // have left notifications/orders/profile in the cache (e.g. expired
      // session → login as a different account without an explicit logout)
      queryClient.clear();
    },
    onError: (error: Error) => {
      notify.error(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authEndpoints.logout(),

    onSuccess: async () => {
      // Hard navigation, not router.push — tears down the whole JS runtime
      // (React Query cache, router cache, polling intervals) so nothing from
      // this vendor's session can leak into the next login on this browser
      window.location.replace("/login");
    },
    onError: (error: Error) => {
      notify.error(getErrorMessage(error));
    },
  });
}
