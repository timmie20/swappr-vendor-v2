import { notificationQueryKeys } from "@/features/notifications/query-keys";
import {
  AppNotification,
  NotificationQueryParams,
  PaginatedNotifications,
  UnreadCountResponse,
} from "@/features/notifications/types";
import { getErrorMessage } from "@/helpers/get-error-message";
import { notificationEndpoint } from "@/services/notifications";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// No realtime push from the backend — the badge polls the cheap
// COUNT(*) endpoint instead.
const UNREAD_COUNT_POLL_INTERVAL = 60_000;

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: () => notificationEndpoint.getUnreadCount(),
    refetchInterval: UNREAD_COUNT_POLL_INTERVAL,
    select: (data) => data.count,
  });
}

export function useNotifications(
  params: NotificationQueryParams,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationEndpoint.getAll(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationEndpoint.markRead(id),
    onSuccess: ({ data: updated }) => {
      // Patch the cached lists in place and decrement the badge —
      // no need to refetch for a single-row flip.
      queryClient.setQueriesData<PaginatedNotifications>(
        { queryKey: notificationQueryKeys.lists() },
        (old) =>
          old && {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === updated.id ? { ...n, ...updated } : n,
            ),
          },
      );
      queryClient.setQueryData<UnreadCountResponse>(
        notificationQueryKeys.unreadCount(),
        (old) => old && { ...old, count: Math.max(0, old.count - 1) },
      );
    },
    onError: (error) => {
      toast.error("Failed to mark notification as read", {
        description: getErrorMessage(error),
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationEndpoint.markAllRead(),
    onSuccess: () => {
      const readAll = (n: AppNotification): AppNotification =>
        n.is_read ? n : { ...n, is_read: true, read_at: new Date().toISOString() };

      queryClient.setQueriesData<PaginatedNotifications>(
        { queryKey: notificationQueryKeys.lists() },
        (old) =>
          old && { ...old, notifications: old.notifications.map(readAll) },
      );
      queryClient.setQueryData<UnreadCountResponse>(
        notificationQueryKeys.unreadCount(),
        (old) => old && { ...old, count: 0 },
      );
    },
    onError: (error) => {
      toast.error("Failed to mark notifications as read", {
        description: getErrorMessage(error),
      });
    },
  });
}
