import { Badge } from "@/components/ui/badge";
import { PAYMENT_BADGE_MAP, STATUS_BADGE_MAP } from "@/constants/badge";
import { OrderStatus, PaymentStatus } from "@/features/orders/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = STATUS_BADGE_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant } = PAYMENT_BADGE_MAP[status] ?? {
    label: status,
    variant: "outline" as const,
  };
  return <Badge variant={variant}>{label}</Badge>;
}
