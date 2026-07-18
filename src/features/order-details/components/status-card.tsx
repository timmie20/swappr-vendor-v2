"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdvanceStatusDialog } from "@/features/orders/components/advance-status-dialog";
import { CancelOrderDialog } from "@/features/orders/components/cancel-order-dialog";
import { STATUS_BADGE_MAP } from "@/constants/badge";
import {
  FulfillmentType,
  OrderDetails,
  OrderStatus,
  canCancelOrder,
  getNextOrderStatus,
} from "@/features/orders/types";

import { OrderStatusBadge } from "./order-badges";
import { Section } from "./section";

function nextActionLabel(order: OrderDetails, nextStatus: OrderStatus) {
  // "Shipped" reads wrong for pickup orders — the vendor is really
  // marking the order ready for the buyer to collect.
  if (
    nextStatus === OrderStatus.SHIPPED &&
    order.fulfillment?.fulfillment_type === FulfillmentType.PICKUP
  ) {
    return "Mark Ready for Pickup";
  }
  return `Mark as ${STATUS_BADGE_MAP[nextStatus].label}`;
}

export function StatusCard({ order }: { order: OrderDetails }) {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const nextStatus = getNextOrderStatus(order.status);
  const cancellable = canCancelOrder(order.status);

  if (!nextStatus && !cancellable) return null;

  return (
    <>
      <Section
        title="Order Actions"
        description="Move this order to its next stage"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Current status</p>
            <OrderStatusBadge status={order.status} />
          </div>

          {nextStatus && (
            <Button
              size="sm"
              className="w-full gap-2 bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => setStatusDialogOpen(true)}
            >
              {nextActionLabel(order, nextStatus)}
              <ArrowRight className="size-3.5" />
            </Button>
          )}

          {cancellable && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive w-full"
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </Section>

      <AdvanceStatusDialog
        order={order}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
      <CancelOrderDialog
        order={order}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
      />
    </>
  );
}
