"use client";

import { useEffect, useRef, useState } from "react";

import type { InspectionState } from "@/features/inspection/lib";
import { ActivityFeedCard } from "./activity-feed-card";
import { RecentOrdersCard } from "./recent-orders-card";
import { StoreStatusCard } from "./store-status-card";

export function OverviewBody({
  inspectionState,
  pickupEnabled,
}: {
  inspectionState: InspectionState;
  pickupEnabled: boolean;
}) {
  const rightColRef = useRef<HTMLDivElement>(null);

  // Recent orders shouldn't grow or shrink with the order count — it should
  // sit at whatever height the store-status + activity cards add up to, with
  // overflow scrolling inside instead. A CSS stretch/percentage-height chain
  // can't do that once the orders list scrolls (there's nothing definite for
  // the percentage to resolve against, so the browser falls back to the
  // unclipped content height — the card grows instead of scrolling). Measuring
  // the sibling column directly gives the card a real pixel height instead.
  const [rightHeight, setRightHeight] = useState<number>();

  useEffect(() => {
    const node = rightColRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setRightHeight(entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <RecentOrdersCard height={rightHeight} />
      </div>

      <div ref={rightColRef} className="space-y-6">
        <StoreStatusCard
          inspectionState={inspectionState}
          pickupEnabled={pickupEnabled}
        />
        <ActivityFeedCard />
      </div>
    </div>
  );
}
