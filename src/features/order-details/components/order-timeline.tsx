import { Ban, CheckCircle2, Circle } from "lucide-react";

import { formatDate } from "@/helpers/format";
import {
  FulfillmentType,
  OrderDetails,
  OrderStatus,
} from "@/features/orders/types";

function CancelledBanner({ reason }: { reason: string | null }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50/60 px-5 py-4">
      <Ban className="mt-0.5 size-4 shrink-0 text-red-500" />
      <div>
        <p className="text-sm font-semibold text-red-700">Order cancelled</p>
        <p className="mt-0.5 text-xs text-red-600/80">
          {reason || "No cancellation reason was provided."}
        </p>
      </div>
    </div>
  );
}

export function OrderTimeline({ order }: { order: OrderDetails }) {
  const isPickup =
    order.fulfillment?.fulfillment_type === FulfillmentType.PICKUP;

  const steps = [
    { label: "Order Placed", date: order.created_at, done: true },
    {
      label: "Confirmed",
      date: order.confirmed_at,
      done: !!order.confirmed_at,
    },
    {
      label: isPickup ? "Ready for Pickup" : "Shipped",
      date: order.fulfillment_ready_at,
      done: !!order.fulfillment_ready_at,
    },
    {
      label: isPickup ? "Picked Up" : "Delivered",
      date: order.delivered_at,
      done: !!order.delivered_at,
    },
  ];

  return (
    <div className="space-y-3">
      {order.status === OrderStatus.CANCELLED && (
        <CancelledBanner reason={order.cancellation_reason} />
      )}

      <div className="border-border rounded-lg border bg-white px-5 py-5">
        <div className="flex items-start gap-0 overflow-x-auto pb-1">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            const dateInfo = step.date ? formatDate(step.date) : null;
            return (
              <div key={step.label} className="flex min-w-0 flex-1 items-start">
                <div className="flex shrink-0 flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                      step.done
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="size-4 text-white" />
                    ) : (
                      <Circle className="size-4 text-gray-300" />
                    )}
                  </div>
                  <div className="mt-2 px-1 text-center">
                    <p
                      className={`text-xs font-medium whitespace-nowrap ${
                        step.done ? "text-muted-foreground" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {dateInfo ? (
                      <p className="text-muted-foreground mt-0.5 text-xs whitespace-nowrap">
                        {dateInfo.full}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-gray-300">—</p>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div
                    className={`mx-1 mt-3.5 h-0.5 flex-1 ${
                      step.done && steps[i + 1].done
                        ? "bg-teal-600"
                        : "bg-gray-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
