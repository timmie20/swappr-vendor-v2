"use client";

import { vendorQueryKeys } from "@/features/account/query-keys";
import { getErrorMessage } from "@/helpers/get-error-message";
import { notify } from "@/helpers/notify";
import { vendorEndpoints } from "@/services/vendor";
import type { UpdateVendorProfilePayload } from "@/schemas/vendor";
import type { VendorProfile } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useVendorProfile() {
  return useQuery({
    queryKey: vendorQueryKeys.profile(),
    queryFn: () => vendorEndpoints.getMe(),
  });
}

export function useUpdateVendorProfile(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateVendorProfilePayload) =>
      vendorEndpoints.updateProfile(vendorId, payload),
    onSuccess: (data) => {
      notify.success(data.message || "Profile updated");
      queryClient.invalidateQueries({ queryKey: vendorQueryKeys.all() });
    },
    onError: (error) => {
      notify.error(getErrorMessage(error));
    },
  });
}

/**
 * Kicks the vendor into the "inspection pending" state — the confirm action
 * of the inspection dialog lands here.
 */
export function useRequestInspection() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => vendorEndpoints.requestInspection(),
    onSuccess: (data) => {
      notify.success(data.message);
      queryClient.invalidateQueries({ queryKey: vendorQueryKeys.all() });
      // The inspection banner lives in the server-rendered dashboard layout —
      // re-render it so the request (from the settings card or anywhere else)
      // recomputes the banner's visibility, not just the client query cache
      router.refresh();
    },
    onError: (error) => {
      notify.error(getErrorMessage(error));
    },
  });
}

/**
 * Optimistic toggle for pickup_enabled — the switch flips instantly and
 * rolls back if the request fails. Callers must gate enabling behind
 * is_inspection_verified (the backend 403s otherwise).
 */
export function useTogglePickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled: boolean) => vendorEndpoints.togglePickup(enabled),
    onMutate: async (enabled) => {
      await queryClient.cancelQueries({ queryKey: vendorQueryKeys.profile() });

      const previous = queryClient.getQueryData<VendorProfile>(
        vendorQueryKeys.profile(),
      );

      queryClient.setQueryData<VendorProfile>(
        vendorQueryKeys.profile(),
        (old) => (old ? { ...old, pickup_enabled: enabled } : old),
      );

      return { previous };
    },
    onError: (error, _enabled, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vendorQueryKeys.profile(), context.previous);
      }
      notify.error(getErrorMessage(error));
    },
    onSuccess: (data) => {
      notify.success(data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vendorQueryKeys.profile() });
    },
  });
}
