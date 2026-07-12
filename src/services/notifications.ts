import {
  MarkReadResponse,
  NotificationQueryParams,
  PaginatedNotifications,
  UnreadCountResponse,
} from "@/features/notifications/types";
import { api } from "@/lib/api/client";

export const notificationEndpoint = {
  async getAll(
    params?: NotificationQueryParams,
  ): Promise<PaginatedNotifications> {
    const { data } = await api.get("/notifications", { params });
    return data;
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const { data } = await api.get("/notifications/unread-count");
    return data;
  },

  async markRead(id: string): Promise<MarkReadResponse> {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  async markAllRead(): Promise<{ message: string }> {
    const { data } = await api.patch("/notifications/read-all");
    return data;
  },
};
