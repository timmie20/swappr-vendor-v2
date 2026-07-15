// Response of GET /vendor/overview/summary — the aggregates behind the
// KPI tiles, grouped by domain. A fresh vendor gets all zeros, never an error.
// revenue_this_month is a Naira decimal, same unit as Order.total_amount —
// kobo conversion only happens at the Paystack API boundary.
export interface VendorOverviewSummary {
  message: string;
  orders: {
    needs_action_count: number;
    this_month_count: number;
    revenue_this_month: number;
  };
  listings: {
    active_count: number;
    out_of_stock_count: number;
  };
  generated_at: string;
}
