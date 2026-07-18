import { ListChecks } from "lucide-react";

import { InfoRow, Section } from "@/components/shared/section";
import { Product } from "@/features/inventory/types";

export function SpecificationsCard({ product }: { product: Product }) {
  if (!product.specifications?.length) return null;

  return (
    <Section title="Specifications" icon={ListChecks}>
      <div className="-my-1 divide-y divide-gray-50">
        {product.specifications.map((spec, index) => (
          <InfoRow
            key={`${spec.key}-${index}`}
            label={spec.key.charAt(0).toUpperCase() + spec.key.slice(1)}
            value={spec.value}
          />
        ))}
      </div>
    </Section>
  );
}
