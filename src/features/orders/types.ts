// import { Pagination } from "@/types/pagination";

// export type OrderStatus =
//   | "pending"
//   | "confirmed"
//   | "processing"
//   | "shipped"
//   | "delivered"
//   | "cancelled";

// export type OrderMethod = string;

// export type Order = {
//   id: string;
//   order_number: string;
//   invoice_no: string;
//   order_time: string;
//   total_amount: number;
//   status: OrderStatus;
//   buyer: {
//     first_name: string;
//     last_name: string;
//     email?: string;
//     phone?: string | null;
//     address?: string | null;
//   };

//   delivery_address: {
//     city: string;
//     state: string;
//     street: string;
//     postal_code: string;
//   };
//   contact_phone: string;
// };

// export interface OrdersQueryParams {
//   page?: number;
//   limit?: number;
//   status?: OrderStatus;
//   search?: string;
// }

// export type OrdersApiResponse = {
//   orders: Order[];
//   total: number;
//   page: number;
//   limit: number;
// };

// export type OrderDetails = {
//   id: string;
//   order_number: string;
//   invoice_no: string;
//   order_time: string;
//   total_amount: number;
//   shipping_cost: number;
//   payment_method: OrderMethod;
//   status: OrderStatus;
//   tracking_number?: string | null;
//   cancellation_reason?: string | null;
//   customers: {
//     name: string;
//     email: string;
//     phone?: string | null;
//     address?: string | null;
//   };
//   order_items: {
//     quantity: number;
//     unit_price: number;
//     products: {
//       name: string;
//     };
//   }[];
//   coupons: {
//     discount_type: "fixed" | "percentage";
//     discount_value: number;
//   } | null;
// };

// export type OrdersExport = {
//   id: string;
//   invoice_no: string;
//   order_time: string;
//   total_amount: number;
//   shipping_cost: number;
//   payment_method: OrderMethod;
//   status: OrderStatus;
//   created_at?: string;
//   updated_at?: string;
//   discount: string;
//   customer_name: string;
//   customer_email: string;
// };

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
  total_amount: string;
  buyer_id: string;
  buyer: OrderBuyer;
  vendor_id: string;
  delivery_address: DeliveryAddress;
  contact_phone: string;
  cancellation_reason: string | null;
  tracking_number: string | null;
  swap_device_name: string | null;
  swap_device_condition: string | null;
  swap_device_images: string[] | null;
  swap_device_assessed_value: string | null;
  confirmed_at: string | null;
  delivered_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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
