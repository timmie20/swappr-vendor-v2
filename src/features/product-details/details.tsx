"use client";

import { Product } from "../inventory/types";

import { AttributesCard } from "./components/attributes-card";
import { ProductHero } from "./components/product-hero";
import { SpecificationsCard } from "./components/specifications-card";

export default function Details({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <ProductHero product={product} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <AttributesCard product={product} />
        <SpecificationsCard product={product} />
      </div>
    </div>
  );
}
