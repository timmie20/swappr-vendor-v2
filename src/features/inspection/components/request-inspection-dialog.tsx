"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { useRequestInspection } from "@/hooks/services/use-vendor";

type RequestInspectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after the request lands successfully (dialog closes itself) */
  onRequested?: () => void;
};

/**
 * The inspection explainer + trigger. Opens when a vendor tries to enable
 * store pickup before their store is inspection-verified (or from the
 * banner CTA); confirming fires POST /vendor/settings/request-inspection.
 */
export function RequestInspectionDialog({
  open,
  onOpenChange,
  onRequested,
}: RequestInspectionDialogProps) {
  const { mutate: requestInspection, isPending } = useRequestInspection();

  const onConfirm = () => {
    requestInspection(undefined, {
      onSuccess: () => {
        onOpenChange(false);
        onRequested?.();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Icons.store className="text-primary size-5" />
            Your store needs a quick inspection first
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 pt-1">
              <p>
                Store pickup lets buyers walk into your store to collect their
                orders — so before we show your address at checkout, Swappr
                verifies that your store is really where you say it is.
              </p>
              <p>
                Confirming here sends an inspection request to the Swappr team.
                They&apos;ll be in touch to confirm your store location and
                schedule a short visit. Once your store is verified, the pickup
                toggle unlocks and you can switch it on anytime.
              </p>
              <p className="text-xs text-amber-700">
                Heads up: changing your business address later will reset this
                verification, and pickup will be turned off until your new
                location is inspected again.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Not now</AlertDialogCancel>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Requesting..." : "Request inspection"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
