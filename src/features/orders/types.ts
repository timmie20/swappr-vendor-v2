import type { TableQueryParams } from "@/hooks/use-table-state";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum OrderType {
  PURCHASE = "purchase",
  SWAP = "swap",
}

export interface OrderBuyer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  color: string | null;
  storage: number | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
  image?: string | null;
}

export interface DeliveryAddress {
  city: string;
  state: string;
  street: string;
  postal_code: string;
}

export enum FulfillmentType {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}

export type EstimatedArrival = "same_day" | "within_24h" | "2_3_days";

export const ESTIMATED_ARRIVAL_LABELS: Record<EstimatedArrival, string> = {
  same_day: "Same day",
  within_24h: "Within 24 hours",
  "2_3_days": "2-3 days",
};

// Delivery/pickup-specific fields are only populated once the vendor
// drives the order through processing -> shipped; pickup_location is the
// exception — it's the vendor's verified address, snapshotted at order
// creation, so it's present from the start on pickup orders.

export interface OrderFulfillment {
  fulfillment_type: FulfillmentType;
  rider_name: string | null;
  rider_phone: string | null;
  delivery_fee: number | null;
  estimated_arrival: EstimatedArrival | null;
  pickup_location: DeliveryAddress | null;
  pickup_date: string | null;
  pickup_time_from: string | null;
  pickup_time_to: string | null;
  pickup_code: string | null;
  tracking_number: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  buyer_id: string;
  buyer: OrderBuyer;
  vendor_id: string;
  delivery_address: DeliveryAddress;
  contact_phone: string;
  fulfillment: OrderFulfillment | null;
  cancellation_reason: string | null;
  tracking_number: string | null;
  transaction_reference: string | null;
  confirmed_at: string | null;
  fulfillment_ready_at: string | null;
  delivered_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface OrderDetails extends Order {
  items: OrderItem[];
}

// The paginated envelope your API returns
export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// What the update status mutation accepts.
// `status` is the target status; extra fields depend on the transition.
// Moving processing -> shipped now requires fulfillment-type-specific
// fields instead of a vendor-entered tracking number — the backend
// generates and returns the tracking number / pickup code itself.
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  cancellation_reason?: string;
  rider_name?: string;
  rider_phone?: string;
  delivery_fee?: number;
  estimated_arrival?: EstimatedArrival;
  pickup_date?: string;
  pickup_time_from?: string;
  pickup_time_to?: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: OrderDetails;
}

// Linear forward progression a vendor can drive an order through.
// Purchase orders auto-confirm on payment (pending -> confirmed happens via
// webhook) and the swap-only pending -> confirmed/rejected actions don't have
// a designed FE flow yet, so both are intentionally left out here.
const FORWARD_STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.CONFIRMED]: OrderStatus.PROCESSING,
  [OrderStatus.PROCESSING]: OrderStatus.SHIPPED,
  [OrderStatus.SHIPPED]: OrderStatus.DELIVERED,
};

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  return FORWARD_STATUS_TRANSITIONS[status] ?? null;
}

// Cancellation is blocked once an order is shipped, delivered, cancelled or rejected.
const CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
];

export function canCancelOrder(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

// Extends the shared table params — room to add order-specific
// filters (e.g. status filter) later without touching the hook
export type OrderQueryParams = TableQueryParams & {
  status?: OrderStatus;
};
