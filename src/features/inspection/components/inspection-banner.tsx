"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { X } from "lucide-react";
import { inspectionBannerDismissKey } from "@/features/inspection/lib";
import { RequestInspectionDialog } from "./request-inspection-dialog";

// Session-scoped dismissal ("Maybe later") — clears when the tab closes;
// the localStorage key ("Don't show again") is permanent per vendor
const sessionDismissKey = (vendorId: string) =>
  `swappr_session_hide_inspection_banner_${vendorId}`;

type InspectionBannerProps = {
  vendorId: string;
};

/**
 * Dashboard-wide nudge to request a store inspection, shown until the vendor
 * either requests one or dismisses it. Rendered only when the server sees the
 * vendor in the "not yet requested" state.
 */
export function InspectionBanner({ vendorId }: InspectionBannerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Storage is client-only — start hidden, reveal after mount so the
  // server-rendered HTML never disagrees with the first client render
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed =
      localStorage.getItem(inspectionBannerDismissKey(vendorId)) === "1" ||
      sessionStorage.getItem(sessionDismissKey(vendorId)) === "1";
    setVisible(!dismissed);
  }, [vendorId]);

  if (!visible) return null;

  const dismissForSession = () => {
    sessionStorage.setItem(sessionDismissKey(vendorId), "1");
    setVisible(false);
  };

  const dismissForever = () => {
    localStorage.setItem(inspectionBannerDismissKey(vendorId), "1");
    setVisible(false);
  };

  return (
    <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100/70 to-amber-50 px-6 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
            <Icons.store className="size-5 text-amber-600" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-950">
              Unlock store pickup — get your store verified
            </p>
            <p className="text-xs text-amber-800">
              A one-time Swappr inspection confirms your store location so
              buyers can pick up orders in person. It&apos;s free and only
              takes one visit.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            Request inspection
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-amber-800 hover:bg-amber-500/10 hover:text-amber-900"
            onClick={dismissForSession}
          >
            Maybe later
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Don't show this again"
            title="Don't show this again"
            className="size-8 text-amber-700 hover:bg-amber-500/10 hover:text-amber-900"
            onClick={dismissForever}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <RequestInspectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onRequested={() => setVisible(false)}
      />
    </div>
  );
}
