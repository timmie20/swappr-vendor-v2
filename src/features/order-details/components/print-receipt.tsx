"use client";

import { ShieldCheck } from "lucide-react";

import { ASSETS } from "@/constants/assets";
import { formatCurrency, formatDate } from "@/helpers/format";
import { useVendorProfile } from "@/hooks/services/use-vendor";
import { FulfillmentType, OrderDetails } from "@/features/orders/types";

// Rendered hidden on screen and shown only in print media — the rest of
// the page is print:hidden, so this is the entire printed document.
//
// print-color-adjust keeps the accent bar and footer tint from being
// stripped out — browsers drop background colors on print by default
// unless told otherwise, and this receipt is meant to look designed, not
// like a plain text dump.
export function PrintReceipt({ order }: { order: OrderDetails }) {
  const { data: vendor } = useVendorProfile();

  const vendorName = vendor?.trading_name || vendor?.business_name || "Vendor";
  const vendorLocation = [vendor?.city, vendor?.state]
    .filter(Boolean)
    .join(", ");

  const placed = formatDate(order.created_at);
  const printedAt = formatDate(new Date().toISOString());

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );
  const deliveryFee = order.fulfillment?.delivery_fee ?? 0;

  const isPickup = order.fulfillment?.fulfillment_type === FulfillmentType.PICKUP;
  const fulfillmentAddress = isPickup
    ? order.fulfillment?.pickup_location
    : order.delivery_address;
  const fulfillmentAddressLine = fulfillmentAddress
    ? [
        fulfillmentAddress.street,
        fulfillmentAddress.city,
        fulfillmentAddress.state,
        fulfillmentAddress.postal_code,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div
      className="hidden bg-white font-sans text-gray-900 print:block"
      style={
        {
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        } as React.CSSProperties
      }
    >
      {/* Accent bar — the one branded touch bold enough to survive print */}
      <div className="bg-primary h-2 w-full" />

      <div className="p-10">
        {/* Vendor branding — this is a receipt for a purchase from this
            vendor's store, so their identity leads, not Swappr's */}
        <div className="mb-8 flex items-start justify-between gap-6 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            {vendor?.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendor.logo_url}
                alt={vendorName}
                className="h-14 w-14 shrink-0 rounded-lg border border-gray-100 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-lg font-semibold text-gray-400">
                {vendorName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{vendorName}</h1>
              {vendorLocation && (
                <p className="mt-0.5 text-sm text-gray-500">{vendorLocation}</p>
              )}
              {vendor?.contact_number && (
                <p className="text-xs text-gray-400">{vendor.contact_number}</p>
              )}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs font-medium tracking-widest text-gray-400 uppercase">
              Receipt
            </p>
            <p className="mt-1 text-sm font-semibold">{order.order_number}</p>
            <p className="mt-0.5 text-xs text-gray-400">{placed?.full}</p>
          </div>
        </div>

        {/* Buyer + fulfillment */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="mb-2 text-xs font-medium tracking-widest text-gray-400 uppercase">
              Billed to
            </h2>
            <p className="text-sm font-medium">
              {order.buyer?.first_name} {order.buyer?.last_name}
            </p>
            <p className="text-sm text-gray-500">{order.buyer?.email}</p>
            <p className="text-sm text-gray-500">{order.contact_phone}</p>
          </div>

          {fulfillmentAddressLine && (
            <div>
              <h2 className="mb-2 text-xs font-medium tracking-widest text-gray-400 uppercase">
                {isPickup ? "Pickup from" : "Delivered to"}
              </h2>
              <p className="text-sm leading-relaxed text-gray-500">
                {fulfillmentAddressLine}
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="mb-3 text-xs font-medium tracking-widest text-gray-400 uppercase">
            Items
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium text-gray-500">Product</th>
                <th className="pb-2 text-center font-medium text-gray-500">
                  Qty
                </th>
                <th className="pb-2 text-right font-medium text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5">
                    <p className="font-medium">{item.product_name}</p>
                    {(item.color || item.storage) && (
                      <p className="text-xs text-gray-400">
                        {[
                          item.color,
                          item.storage ? `${item.storage}GB` : null,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 text-center text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 text-right font-medium">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 space-y-1.5 border-t border-gray-200 pt-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery fee</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="mb-8 border-t border-gray-100 pt-4 text-sm">
          <p className="text-gray-500">
            Payment status:{" "}
            <span className="font-medium text-gray-900">
              {order.payment_status}
            </span>
          </p>
          {order.transaction_reference && (
            <p className="mt-1 text-gray-500">
              Reference:{" "}
              <span className="font-mono text-xs">
                {order.transaction_reference}
              </span>
            </p>
          )}
        </div>

        {/* Legitimacy statement — this is the part that makes the printout
            usable as actual proof of purchase, not just a summary */}
        <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <ShieldCheck className="text-primary mt-0.5 size-5 shrink-0" />
          <div className="text-xs leading-relaxed text-gray-500">
            <p className="font-medium text-gray-700">
              This is an official Swappr receipt.
            </p>
            <p className="mt-0.5">
              Issued via Swappr, this document legitimately confirms the
              purchase of the goods listed above from {vendorName}. Keep it
              as your proof of purchase.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[11px] text-gray-300">
            Printed {printedAt?.full}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.LOGO_DARK} alt="Swappr" className="h-4 w-auto" />
        </div>
      </div>
    </div>
  );
}
