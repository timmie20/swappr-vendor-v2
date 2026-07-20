import { TableQueryParams } from "@/hooks/use-table-state";

export enum PayoutStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface Payout {
  id: string;
  order_id: string | null; // null = swap payout (future); non-null = order payout
  payment_id: string;
  vendor_id: string;
  gross_amount: string; // decimal string — cast with Number() before formatting
  platform_fee: string;
  net_amount: string;
  status: PayoutStatus;
  transfer_reference: string;
  transfer_code: string | null;
  failure_reason: string | null;
  retry_count: number;
  initiated_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export type PaginatedPayouts = {
  message: string;
  payouts: Payout[];
  total: number;
  page: number;
  limit: number;
};

export interface PayoutSummary {
  message: string;
  summary: {
    total_paid_out: number;
    pending_balance: number;
    failed_amount: number;
  };
}

// Amount/date range filters are forwarded straight through to the API as
// query-string values, so they stay strings here — same treatment as the
// other useFilterState-driven fields (e.g. status).
export type PayoutQueryParams = TableQueryParams & {
  status?: PayoutStatus;
  min_amount?: string;
  max_amount?: string;
  created_from?: string;
  created_to?: string;
};
