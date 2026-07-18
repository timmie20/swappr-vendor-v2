"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/format";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/services/use-notifications";
import { AppNotification, getNotificationHref } from "../types";

const PANEL_PAGE_SIZE = 20;

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  // The list is only fetched once the panel is opened — the badge
  // polls the cheap count endpoint on its own.
  const { data, isLoading, isError } = useNotifications(
    { page: 1, limit: PANEL_PAGE_SIZE },
    { enabled: open },
  );

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];

  const handleMarkRead = (notificationId: string, isRead: boolean) => {
    if (!isRead) markRead.mutate(notificationId);
  };

  // Selecting a notification only navigates — marking read is reserved
  // for the explicit "View more" toggle so unread state isn't cleared
  // by a stray click.
  const handleSelect = (notification: AppNotification) => {
    const href = getNotificationHref(notification);
    if (href) {
      setOpen(false);
      router.push(href);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="relative cursor-pointer"
          aria-label={
            unreadCount > 0
              ? `Notifications (${unreadCount} unread)`
              : "Notifications"
          }
        >
          <Icons.bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-86 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-auto cursor-pointer px-2 py-1 text-xs"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <Separator />

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <NotificationListSkeleton />
          ) : isError ? (
            <p className="text-muted-foreground px-4 py-8 text-center text-sm">
              Couldn’t load notifications. Please try again.
            </p>
          ) : notifications.length === 0 ? (
            <p className="text-muted-foreground px-4 py-8 text-center text-sm">
              You’re all caught up — no notifications yet.
            </p>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onSelect={handleSelect}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  notification,
  onSelect,
  onMarkRead,
}: {
  notification: AppNotification;
  onSelect: (notification: AppNotification) => void;
  onMarkRead: (notificationId: string, isRead: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const time = formatDate(notification.created_at);

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev);
    onMarkRead(notification.id, notification.is_read);
  };

  return (
    <div
      className={cn(
        "hover:bg-accent flex w-full items-start gap-3 px-4 py-3 transition-colors",
        !notification.is_read && "bg-accent/40",
      )}
    >
      {/* unread indicator dot */}
      <span
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full transition-colors",
          notification.is_read ? "bg-transparent" : "bg-primary",
        )}
      />

      <div className="min-w-0 flex-1 space-y-1">
        {/* title — triggers onSelect */}
        <button
          type="button"
          onClick={() => onSelect(notification)}
          className="block w-full text-left"
        >
          <span
            className={cn(
              "block truncate text-sm",
              notification.is_read
                ? "text-muted-foreground font-normal"
                : "font-medium",
            )}
          >
            {notification.title}
          </span>
        </button>

        {/* animated message */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <p className="text-muted-foreground pt-0.5 pb-1 text-xs">
              {notification.message}
            </p>
          </div>
        </div>

        {/* timestamp + expand toggle */}
        <div className="flex items-center justify-between">
          {time && (
            <span className="text-muted-foreground/70 text-xs">
              {time.relative}
            </span>
          )}
          <button
            type="button"
            onClick={handleExpandToggle}
            className="text-primary ml-auto flex cursor-pointer items-center gap-0.5 text-xs transition-opacity hover:opacity-70"
          >
            {isExpanded ? "Show less" : "View more"}
            <Icons.chevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-300",
                isExpanded && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-2 py-3">
          <Skeleton className="mt-1.5 size-2 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
