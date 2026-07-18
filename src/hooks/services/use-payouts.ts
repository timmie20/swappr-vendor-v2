import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { payoutQueryKeys } from "@/features/payouts/query-keys";
import { PayoutQueryParams } from "@/features/payouts/types";
import { payoutEndpoints } from "@/services/payouts";

export function usePayouts(params: PayoutQueryParams) {
  return useQuery({
    queryKey: payoutQueryKeys.list(params),
    queryFn: () => payoutEndpoints.getAll(params),
    placeholderData: keepPreviousData,
  });
}

// Deliberately takes no params — a fixed query key means table filtering
// never invalidates or refetches this one, per the "fetch once" requirement.
export function usePayoutSummary() {
  return useQuery({
    queryKey: payoutQueryKeys.summary(),
    queryFn: () => payoutEndpoints.getSummary(),
    staleTime: 60_000,
  });
}
