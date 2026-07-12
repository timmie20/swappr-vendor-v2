import { Package, Truck } from "lucide-react";

import { formatCurrency, formatDate } from "@/helpers/format";
import { FULFILLMENT_BADGE_MAP } from "@/constants/badge";
import {
  ESTIMATED_ARRIVAL_LABELS,
  FulfillmentType,
  OrderDetails,
} from "@/features/orders/types";

import { CopyButton } from "./copy-button";
import { InfoRow, Section } from "./section";

// Tracking numbers / pickup codes are what the vendor reads out or
// pastes to the buyer — surface them as a prominent copyable block
// rather than an ordinary info row.
function CodeBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 mt-3 flex items-center justify-between gap-2 rounded-md border px-3 py-2">
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate font-mono text-sm font-semibold">{value}</p>
      </div>
      <CopyButton value={value} label={label} />
    </div>
  );
}

export function FulfillmentCard({ order }: { order: OrderDetails }) {
  const { fulfillment } = order;
  if (!fulfillment) return null;

  const isPickup = fulfillment.fulfillment_type === FulfillmentType.PICKUP;
  const { label } = FULFILLMENT_BADGE_MAP[fulfillment.fulfillment_type];
  const pickupDate = fulfillment.pickup_date
    ? formatDate(fulfillment.pickup_date)
    : null;
  const trackingNumber =
    order.tracking_number ?? fulfillment.tracking_number ?? null;

  const pickupAddress = fulfillment.pickup_location
    ? [
        fulfillment.pickup_location.street,
        fulfillment.pickup_location.city,
        fulfillment.pickup_location.state,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <Section title={label} icon={isPickup ? Package : Truck}>
      <div className="-my-1 divide-y divide-gray-50">
        {isPickup ? (
          <>
            {pickupAddress && (
              <InfoRow label="Pickup location" value={pickupAddress} />
            )}
            {pickupDate && (
              <InfoRow label="Pickup date" value={pickupDate.full} />
            )}
            {fulfillment.pickup_time_slot && (
              <InfoRow label="Time slot" value={fulfillment.pickup_time_slot} />
            )}
          </>
        ) : (
          <>
            {fulfillment.rider_name && (
              <InfoRow label="Rider" value={fulfillment.rider_name} />
            )}
            {fulfillment.rider_phone && (
              <InfoRow label="Rider phone" value={fulfillment.rider_phone} />
            )}
            {fulfillment.delivery_fee != null && (
              <InfoRow
                label="Delivery fee"
                value={formatCurrency(fulfillment.delivery_fee)}
              />
            )}
            {fulfillment.estimated_arrival && (
              <InfoRow
                label="Estimated arrival"
                value={ESTIMATED_ARRIVAL_LABELS[fulfillment.estimated_arrival]}
              />
            )}
          </>
        )}
      </div>

      {isPickup && fulfillment.pickup_code && (
        <CodeBlock label="Pickup code" value={fulfillment.pickup_code} />
      )}
      {!isPickup && trackingNumber && (
        <CodeBlock label="Tracking number" value={trackingNumber} />
      )}
    </Section>
  );
}
