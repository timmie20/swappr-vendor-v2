import {
  PaginatedPayouts,
  PayoutQueryParams,
  PayoutSummary,
} from "@/features/payouts/types";
import { serverFetch } from "@/lib/api/server";

export async function fetchPayouts(
  params?: PayoutQueryParams,
): Promise<PaginatedPayouts> {
  const res = await serverFetch<PaginatedPayouts>("/payments/payouts", {
    params: params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([, v]) => v != null) // strip undefined/null
            .map(([k, v]) => [k, String(v)]), // coerce all values to string
        )
      : undefined,
  });
  return res;
}

export async function fetchPayoutSummary(): Promise<PayoutSummary> {
  const res = await serverFetch<PayoutSummary>("/payments/payouts/summary");
  return res;
}
