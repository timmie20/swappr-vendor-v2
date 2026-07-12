"use client";

import { useEffect, useState } from "react";

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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateOrderStatus } from "@/hooks/services/use-orders";
import { type Order, OrderStatus } from "../types";

interface CancelOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelOrderDialog({
  order,
  open,
  onOpenChange,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState("");
  const { mutateAsync, isPending } = useUpdateOrderStatus();

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleConfirm = async () => {
    if (!order) return;
    await mutateAsync({
      id: order.id,
      status: OrderStatus.CANCELLED,
      cancellation_reason: reason.trim() || undefined,
    });
    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle>
            Cancel order #{order.order_number}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will cancel the order for the buyer. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor="cancellation_reason">Reason (optional)</Label>
          <Textarea
            id="cancellation_reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Item damaged in warehouse"
            disabled={isPending}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Back</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleConfirm}
            type="button"
            size="lg"
            variant="destructive"
          >
            {isPending && <Spinner className="mr-2" />}
            Cancel order
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
