"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginCredentials } from "@/types/auth";
import { authEndpoints } from "@/services/auth";
import { notify } from "@/helpers/notify";
import { getErrorMessage } from "@/helpers/get-error-message";
import { useRouter } from "next/navigation";

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

export function useLogout() {
  const router = useRouter();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authEndpoints.logout(),

    onSuccess: async (res) => {
      notify.success(res.message || "Logged out successfully");
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      router.push("/login");
    },
    onError: (error: Error) => {
      notify.error(getErrorMessage(error));
    },
  });
}
