import type { NotificationQueryParams } from "./types";

export const notificationQueryKeys = {
  // Matches everything notification-related — invalidate this to nuke all notification cache
  all: () => ["notifications"] as const,

  // Matches all notification lists regardless of params
  lists: () => [...notificationQueryKeys.all(), "list"] as const,

  // Matches one specific list with its exact params
  list: (params: NotificationQueryParams) =>
    [...notificationQueryKeys.lists(), params] as const,

  // The unread-count badge query
  unreadCount: () => [...notificationQueryKeys.all(), "unread-count"] as const,
} as const;
