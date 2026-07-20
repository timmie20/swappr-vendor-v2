import { MapPin, User } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/helpers/format";
import { OrderDetails } from "@/features/orders/types";

import { InfoRow, Section } from "./section";

// Buyer identity and where the order is going, in one card — they're
// read together when contacting the customer, so they live together.
export function CustomerCard({ order }: { order: OrderDetails }) {
  const { buyer, delivery_address: address } = order;
  const fullName = [buyer?.first_name, buyer?.last_name]
    .filter(Boolean)
    .join(" ");

  const fullAddress = address
    ? [address.street, address.city, address.state, address.postal_code]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <Section title="Customer" icon={User}>
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {fullName ? getInitials(fullName) : <User className="size-4" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {fullName || "—"}
          </p>
          <p className="truncate text-xs text-gray-400">{buyer?.email}</p>
        </div>
      </div>

      {(fullAddress || order.contact_phone) && (
        <>
          <Separator className="my-4" />
          <div className="-my-1 divide-y divide-gray-50">
            {fullAddress && (
              <InfoRow
                label="Delivery address"
                value={
                  <span className="inline-flex items-start gap-1.5 text-left">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                    <span className="leading-relaxed">{fullAddress}</span>
                  </span>
                }
                valueClassName="text-left"
              />
            )}
            {order.contact_phone && (
              <InfoRow label="Contact" value={order.contact_phone} />
            )}
          </div>
        </>
      )}
    </Section>
  );
}
