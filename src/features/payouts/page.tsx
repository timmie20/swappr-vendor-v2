import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import Typography from "@/components/ui/typography";
import { getQueryClient } from "@/lib/query/prefetch";
import { defaultQueryParams } from "@/constants/query";
import { fetchPayoutSummary, fetchPayouts } from "@/server-actions/payouts";

import { payoutQueryKeys } from "./query-keys";
import PayoutsTable from "./components/payout-table";
import { PayoutSummaryTiles } from "./components/payout-summary-tiles";

export default async function PayoutsPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: payoutQueryKeys.list(defaultQueryParams),
    queryFn: () => fetchPayouts(),
  });

  await queryClient.prefetchQuery({
    queryKey: payoutQueryKeys.summary(),
    queryFn: () => fetchPayoutSummary(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <Typography variant="h2" className="text-left">
          Payouts
        </Typography>
        <PayoutSummaryTiles />
        <PayoutsTable />
      </div>
    </HydrationBoundary>
  );
}
