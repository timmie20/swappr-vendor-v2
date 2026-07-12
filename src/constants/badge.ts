import { BadgeProps } from "@/components/ui/badge";
import { ProductStatus } from "@/features/inventory/types";
import { FulfillmentType, OrderStatus } from "@/features/orders/types";

type BadgeVariantProps = BadgeProps["variant"];

export const STATUS_BADGE_MAP: Record<
  OrderStatus,
  {
    label: string;
    variant: BadgeVariantProps;
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
    variant: BadgeVariantProps;
  }
> = {
  paid: { label: "Paid", variant: "paid" },
  unpaid: { label: "Unpaid", variant: "unpaid" },
};

export const FULFILLMENT_BADGE_MAP: Record<
  FulfillmentType,
  {
    label: string;
    variant: BadgeVariantProps;
  }
> = {
  [FulfillmentType.PICKUP]: { label: "Pickup", variant: "outline" },
  [FulfillmentType.DELIVERY]: { label: "Delivery", variant: "secondary" },
};

export const PRODUCT_BADGE_MAP: Record<
  ProductStatus,
  { label: string; variant: BadgeVariantProps }
> = {
  selling: { label: "Selling", variant: "default" },
  out_of_stock: { label: "Out of Stock", variant: "destructive" },
};
