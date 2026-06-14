import { OrderStatus } from "@/features/orders/types";

export const STATUS_BADGE_MAP: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  [OrderStatus.PENDING]: { label: "Pending", variant: "secondary" },
  [OrderStatus.CONFIRMED]: { label: "Confirmed", variant: "default" },
  [OrderStatus.PROCESSING]: { label: "Processing", variant: "default" },
  [OrderStatus.SHIPPED]: { label: "Shipped", variant: "default" },
  [OrderStatus.DELIVERED]: { label: "Delivered", variant: "default" },
  [OrderStatus.CANCELLED]: { label: "Cancelled", variant: "destructive" },
};

export const PAYMENT_BADGE_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  paid: { label: "Paid", variant: "default" },
  unpaid: { label: "Unpaid", variant: "secondary" },
};
