import { Badge } from "@/components/ui/badge";
import { PRODUCT_BADGE_MAP } from "@/constants/badge";
import { formatCurrency } from "@/helpers/format";
import { Product, ProductMode } from "@/features/inventory/types";

import { ProductActions } from "./product-actions";
import { ProductGallery } from "./product-gallery";

const MODE_LABELS: Record<ProductMode, string> = {
  [ProductMode.SALE]: "Sale only",
  [ProductMode.SALE_SWAP]: "Sale & Swap",
};

export function ProductHero({ product }: { product: Product }) {
  const { label, variant } = PRODUCT_BADGE_MAP[product.status];

  return (
    <div className="border-border overflow-hidden rounded-lg border bg-white">
      <div className="flex flex-col gap-6 p-5 md:flex-row lg:gap-8">
        {/* Gallery */}
        <div className="mx-auto w-full max-w-80 shrink-0 md:mx-0 md:w-64 xl:w-80">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Summary */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={variant} className="text-xs capitalize">
              {label}
            </Badge>
            <Badge
              variant={product.is_active ? "default" : "destructive"}
              className="text-xs"
            >
              {product.is_active ? "Published" : "Unpublished"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {MODE_LABELS[product.mode] ?? product.mode}
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {product.brand.brand_name}
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(product.base_price)}
            </p>
            <p className="text-muted-foreground text-sm">
              {product.total_stock} in stock
              {product.variantCount > 0 &&
                ` • ${product.variantCount} variant${product.variantCount === 1 ? "" : "s"}`}
            </p>
          </div>

          {product.description && (
            <p className="text-muted-foreground mt-4 max-w-prose text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-auto pt-6">
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
