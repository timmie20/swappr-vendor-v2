import { OrderStatus } from "@/features/orders/types";

export const STATUS_BADGE_MAP: Record<
  OrderStatus,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "paid"
      | "unpaid"
      | "processing"
      | "shipped";
  }
> = {
  [OrderStatus.PENDING]: { label: "Pending", variant: "secondary" },
  [OrderStatus.CONFIRMED]: { label: "Confirmed", variant: "default" },
  [OrderStatus.PROCESSING]: { label: "Processing", variant: "unpaid" },
  [OrderStatus.SHIPPED]: { label: "Shipped", variant: "shipped" },
  [OrderStatus.DELIVERED]: { label: "Delivered", variant: "paid" },
  [OrderStatus.CANCELLED]: { label: "Cancelled", variant: "destructive" },
};

export const PAYMENT_BADGE_MAP: Record<
  string,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "paid"
      | "unpaid"
      | "refunded";
  }
> = {
  paid: { label: "Paid", variant: "paid" },
  unpaid: { label: "Unpaid", variant: "unpaid" },
};
