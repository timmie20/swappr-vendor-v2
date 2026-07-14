"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentEndpoints } from "@/services/payments";
import { vendorQueryKeys } from "@/features/account/query-keys";
import { notify } from "@/helpers/notify";
import { getErrorMessage } from "@/helpers/get-error-message";

export const paymentQueryKeys = {
  banks: () => ["payments", "banks"] as const,
};

export function useBanks({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: paymentQueryKeys.banks(),
    queryFn: () => paymentEndpoints.getBanks(),
    // The Paystack bank list is effectively static — fetch once per session
    staleTime: Infinity,
    enabled,
  });
}

export function useSaveBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentEndpoints.saveBankAccount,
    onSuccess: (data) => {
      notify.success(data.message || "Bank account saved");
      // The Paystack-resolved account_name comes back on /vendors/me
      queryClient.invalidateQueries({ queryKey: vendorQueryKeys.all() });
    },
    onError: (error) => {
      notify.error(getErrorMessage(error));
    },
  });
}
