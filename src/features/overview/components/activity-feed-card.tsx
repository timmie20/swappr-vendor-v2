"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/format";
import { useRecentActivity } from "@/hooks/services/use-overview";
import {
  AppNotification,
  getNotificationHref,
} from "@/features/notifications/types";
import { SectionRetry } from "./section-retry";

export function ActivityFeedCard() {
  const { data, isLoading, isError, refetch } = useRecentActivity();

  const notifications = data?.notifications ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>

      <CardContent className="px-2 pb-2">
        {isLoading ? (
          <ActivityFeedSkeleton />
        ) : isError ? (
          <SectionRetry
            message="Couldn’t load recent activity."
            onRetry={() => refetch()}
          />
        ) : notifications.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-sm">
            No activity yet.
          </p>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <ActivityItem key={notification.id} notification={notification} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// A passive read-only feed — marking read stays with the bell panel,
// so a glance at the overview never clears unread state.
function ActivityItem({ notification }: { notification: AppNotification }) {
  const href = getNotificationHref(notification);
  const time = formatDate(notification.created_at);

  const body = (
    <>
      <span
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          notification.is_read ? "bg-transparent" : "bg-primary",
        )}
      />
      <span className="min-w-0 flex-1 space-y-0.5">
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
        {time && (
          <span className="text-muted-foreground/70 block text-xs">
            {time.relative}
          </span>
        )}
      </span>
    </>
  );

  const itemClassName =
    "flex w-full items-start gap-3 rounded-md px-4 py-3 text-left";

  if (href) {
    return (
      <Link
        href={href}
        className={cn(itemClassName, "hover:bg-accent transition-colors")}
      >
        {body}
      </Link>
    );
  }

  return <div className={itemClassName}>{body}</div>;
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-2 py-3">
          <Skeleton className="mt-1.5 size-2 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
