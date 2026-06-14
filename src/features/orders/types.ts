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
  cancellation_reason: string | null;
  tracking_number: string | null;
  transaction_reference: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
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

// What the update status mutation accepts
export interface UpdateOrderStatusPayload {
  status: VendorUpdatableStatus;
}

// Vendors can only move orders to these three statuses
export type VendorUpdatableStatus =
  | OrderStatus.PROCESSING
  | OrderStatus.SHIPPED
  | OrderStatus.DELIVERED;

export const VENDOR_UPDATABLE_STATUSES: VendorUpdatableStatus[] = [
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

// Extends the shared table params — room to add order-specific
// filters (e.g. status filter) later without touching the hook
export type OrderQueryParams = TableQueryParams & {
  status?: OrderStatus;
};
