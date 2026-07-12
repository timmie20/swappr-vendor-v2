import { Clock, CreditCard } from "lucide-react";

import { formatCurrency, formatDate } from "@/helpers/format";
import { OrderDetails, PaymentStatus } from "@/features/orders/types";

import { PaymentStatusBadge } from "./order-badges";
import { InfoRow, Section } from "./section";

export function PaymentCard({ order }: { order: OrderDetails }) {
  const expiresInfo = order.expires_at ? formatDate(order.expires_at) : null;

  return (
    <Section title="Payment" icon={CreditCard}>
      <div className="-my-1 divide-y divide-gray-50">
        <InfoRow
          label="Status"
          value={<PaymentStatusBadge status={order.payment_status} />}
        />
        <InfoRow
          label="Total"
          value={formatCurrency(order.total_amount)}
          valueClassName="font-semibold text-gray-900"
        />
        <InfoRow
          label="Reference"
          value={
            <span className="font-mono text-xs text-gray-500">
              {order.transaction_reference || "No reference"}
            </span>
          }
        />
        {order.payment_status === PaymentStatus.UNPAID && expiresInfo && (
          <div className="flex items-center gap-2 py-3">
            <Clock className="size-3.5 shrink-0 text-amber-500" />
            <p className="text-xs text-amber-600">
              Expires {expiresInfo.relative}
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
