"use client";

import { vendorQueryKeys } from "@/features/account/query-keys";
import { getErrorMessage } from "@/helpers/get-error-message";
import { notify } from "@/helpers/notify";
import { vendorEndpoints } from "@/services/vendor";
import type { UpdateVendorProfilePayload } from "@/schemas/vendor";
import type { VendorProfile } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useVendorProfile() {
  return useQuery({
    queryKey: vendorQueryKeys.profile(),
    queryFn: () => vendorEndpoints.getMe(),
  });
}

export function useUpdateVendorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateVendorProfilePayload) =>
      vendorEndpoints.updateMe(payload),
    onSuccess: () => {
      notify.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: vendorQueryKeys.all() });
    },
    onError: (error) => {
      notify.error(getErrorMessage(error));
    },
  });
}

/**
 * Optimistic toggle for pickup_enabled — the switch flips instantly and
 * rolls back if the request fails.
 */
export function useTogglePickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pickup_enabled: boolean) =>
      vendorEndpoints.updateMe({ pickup_enabled }),
    onMutate: async (pickup_enabled) => {
      await queryClient.cancelQueries({ queryKey: vendorQueryKeys.profile() });

      const previous = queryClient.getQueryData<VendorProfile>(
        vendorQueryKeys.profile(),
      );

      queryClient.setQueryData<VendorProfile>(
        vendorQueryKeys.profile(),
        (old) => (old ? { ...old, pickup_enabled } : old),
      );

      return { previous };
    },
    onError: (error, _pickupEnabled, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vendorQueryKeys.profile(), context.previous);
      }
      notify.error(getErrorMessage(error));
    },
    onSuccess: (_data, pickup_enabled) => {
      notify.success(
        pickup_enabled ? "Store pickup enabled" : "Store pickup disabled",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vendorQueryKeys.profile() });
    },
  });
}
