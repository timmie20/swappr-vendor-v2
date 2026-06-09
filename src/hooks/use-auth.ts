"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginCredentials } from "@/types/auth";
import { authEndpoints } from "@/endpoints/auth";
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
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: Error) => {
      notify.error(getErrorMessage(error));
    },
  });
}
