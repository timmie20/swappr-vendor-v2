export enum NotificationType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_PAID = "ORDER_PAID",
  ORDER_CONFIRMED = "ORDER_CONFIRMED",
  ORDER_SHIPPED = "ORDER_SHIPPED",
  ORDER_DELIVERED = "ORDER_DELIVERED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  ORDER_EXPIRED = "ORDER_EXPIRED",
  PRODUCT_APPROVED = "PRODUCT_APPROVED",
  PRODUCT_REJECTED = "PRODUCT_REJECTED",
  VENDOR_ONBOARDING_COMPLETED = "VENDOR_ONBOARDING_COMPLETED",
  SYSTEM = "SYSTEM",
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  // Deep-link payload — shape varies by type. Order types carry at least
  // { order_id, order_number }; VENDOR_ONBOARDING_COMPLETED carries
  // { vendor_id }; may be null.
  data: Record<string, any> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  is_read?: boolean;
}

export interface PaginatedNotifications {
  message: string;
  notifications: AppNotification[];
  total: number;
  page: number;
  limit: number;
}

export interface UnreadCountResponse {
  message: string;
  count: number;
}

export interface MarkReadResponse {
  message: string;
  data: AppNotification;
}

// Where clicking a notification should take the vendor. Order-scoped
// notifications deep-link to the order details page (routed by
// order_number, not order_id). Returns null when there's nowhere to go.
export function getNotificationHref(
  notification: AppNotification,
): string | null {
  const orderNumber = notification.data?.order_number;
  if (orderNumber) return `/orders/${orderNumber}`;
  return null;
}
