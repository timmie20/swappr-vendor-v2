import { Package } from "lucide-react";

import { formatCurrency } from "@/helpers/format";
import { OrderItem } from "@/features/orders/types";

import { Section } from "./section";

function ItemRow({ item }: { item: OrderItem }) {
  const variantBits = [
    item.color,
    item.storage ? `${item.storage}GB` : null,
  ].filter(Boolean);

  return (
    <div className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/50">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.product_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="size-5 text-gray-300" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug font-medium">{item.product_name}</p>
        {variantBits.length > 0 && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            {variantBits.join(" • ")}
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-xs">
          Qty: {item.quantity}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(item.subtotal)}
        </p>
        {item.quantity > 1 && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            {formatCurrency(item.unit_price)} each
          </p>
        )}
      </div>
    </div>
  );
}

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

  return (
    <Section title="Order Items" icon={Package}>
      <div className="-mx-5 -my-4 divide-y divide-gray-50">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-sm">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <span className="text-sm font-semibold">
          {formatCurrency(subtotal)}
        </span>
      </div>
    </Section>
  );
}
