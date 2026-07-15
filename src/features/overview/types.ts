// Response of GET /vendor/overview/summary — the aggregates behind the
// KPI tiles. A fresh vendor gets all zeros, never an error.
// revenue_this_month is a Naira decimal, same unit as Order.total_amount —
// kobo conversion only happens at the Paystack API boundary.
export interface VendorOverviewSummary {
  needs_action_count: number;
  this_month_count: number;
  revenue_this_month: number;
  active_count: number;
  out_of_stock_count: number;
}
