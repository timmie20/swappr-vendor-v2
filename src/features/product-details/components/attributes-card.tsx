import { Tag } from "lucide-react";
import { format } from "date-fns";

import { InfoRow, Section } from "@/components/shared/section";
import { Product } from "@/features/inventory/types";

const humanize = (value: string) => value.replace(/_/g, " ");

export function AttributesCard({ product }: { product: Product }) {
  return (
    <Section title="Product Details" icon={Tag}>
      <div className="-my-1 divide-y divide-gray-50">
        <InfoRow
          label="Category"
          value={<span className="capitalize">{product.category.name}</span>}
        />
        <InfoRow
          label="Sub category"
          value={
            <span className="capitalize">
              {product.subcategory?.name ?? "None"}
            </span>
          }
        />
        <InfoRow
          label="Condition"
          value={<span className="capitalize">{humanize(product.condition)}</span>}
        />
        {product.carrier_status && (
          <InfoRow
            label="Carrier"
            value={
              <span className="capitalize">
                {humanize(product.carrier_status)}
              </span>
            }
          />
        )}
        <InfoRow
          label="Created"
          value={format(new Date(product.created_at), "PPP")}
        />
      </div>
    </Section>
  );
}
