"use client";

import { OrderDetails } from "../orders/types";

import { CustomerCard } from "./components/customer-card";
import { FulfillmentCard } from "./components/fulfillment-card";
import { OrderHeader } from "./components/order-header";
import { OrderItemsList } from "./components/order-items";
import { OrderTimeline } from "./components/order-timeline";
import { PaymentCard } from "./components/payment-card";
import { PrintReceipt } from "./components/print-receipt";
import { StatusCard } from "./components/status-card";
import { OrderDetailsError, OrderDetailsSkeleton } from "./components/states";

interface OrderDetailsPageProps {
  order: OrderDetails | null;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function Details({
  order,
  isLoading,
  isError,
  onRefresh,
  isRefreshing,
}: OrderDetailsPageProps) {
  if (isLoading) return <OrderDetailsSkeleton />;
  if (isError || !order) return <OrderDetailsError onRetry={onRefresh} />;

  return (
    <>
      {/* Print-only receipt — the rest of the page is print:hidden */}
      <PrintReceipt order={order} />

      <div className="space-y-6 print:hidden">
        <OrderHeader
          order={order}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />

        <OrderTimeline order={order} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* Left — what was ordered */}
          <div className="space-y-6">
            <OrderItemsList items={order.items} />
          </div>

          {/* Right — actions first, then context */}
          <div className="space-y-4">
            <StatusCard order={order} />
            <FulfillmentCard order={order} />
            <PaymentCard order={order} />
            <CustomerCard order={order} />
          </div>
        </div>
      </div>
    </>
  );
}
