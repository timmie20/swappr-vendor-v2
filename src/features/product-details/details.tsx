"use client";

import { Badge } from "@/components/ui/badge";
import Typography from "@/components/ui/typography";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import ResubaleSheet from "@/components/resuable-sheet";
import { useState } from "react";

import { Product } from "../inventory/types";

import { PRODUCT_BADGE_MAP } from "@/constants/badge";
import EditProductForm from "../inventory/component/edit-product-form";

import { formatCurrency } from "@/helpers/format";

type ProductDetailsProps = {
  product: Product;
};

export default function Details({ product }: ProductDetailsProps) {
  const [open, setOpen] = useState(false);

  const publishedStatus = product.is_active ? "published" : "unpublished";

  const { label, variant } = PRODUCT_BADGE_MAP[product.status];

  return (
    <section>
      <div className="mt-6 mb-6 flex flex-col gap-6 md:flex-row lg:gap-8">
        <div className="mx-auto w-full max-w-80 shrink-0 md:mx-0 md:max-w-72 xl:max-w-80">
          <Image
            src={product?.images[0] || "/placeholder.png"}
            alt={product.name}
            width={320}
            height={320}
            priority
            className="aspect-square w-full rounded-3xl object-cover"
          />
          <Typography
            component="p"
            className="text-foreground/60 mt-6 ml-2 font-medium"
          >
            <Typography className="font-semibold">Created on</Typography>{" "}
            <Typography className="text-foreground/60">
              {format(new Date(product.created_at), "PPP")}
            </Typography>
          </Typography>
        </div>

        <div className="flex flex-col xl:pr-12">
          <div className="mb-2 flex items-center gap-x-2">
            <Typography component="p" className="font-semibold">
              Status:
            </Typography>

            <Badge variant={variant} className="shrink-0 text-xs capitalize">
              {label}
            </Badge>
            <Badge
              variant={product.is_active ? "default" : "destructive"}
              className="shrink-0 text-xs capitalize"
            >
              {publishedStatus}
            </Badge>
          </div>

          <Typography variant="h2" className="mb-3 text-left">
            {product.name}
          </Typography>

          <Typography component="p" className="mb-3">
            <span className="font-semibold">Brand:</span>{" "}
            <span className="text-foreground/60">
              {product.brand.brand_name}
            </span>
          </Typography>

          <Typography variant="h4">
            {formatCurrency(product.base_price)}
          </Typography>

          <Typography component="p" className="mb-3">
            <span className="font-semibold">Stock:</span>{" "}
            <span className="text-foreground/60">{product.total_stock}</span>
          </Typography>

          {product.description && (
            <Typography
              component="p"
              className="text-foreground/60 mb-3 text-justify"
            >
              {product.description}
            </Typography>
          )}

          <Typography component="p" className="mb-3">
            <span className="font-semibold">Category:</span>{" "}
            <span className="text-foreground/60 capitalize">
              {product.category.name}
            </span>
          </Typography>

          <Typography component="p" className="mb-3">
            <span className="font-semibold">Sub Category:</span>{" "}
            <span className="text-foreground/60 capitalize">
              {!product.subcategory ? "None" : product.subcategory.name}
            </span>
          </Typography>

          <Typography component="p" className="mb-3">
            <span className="font-semibold">Condition:</span>{" "}
            <span className="text-foreground/60 capitalize">
              {product.condition.replace(/_/g, " ")}
            </span>
          </Typography>

          <Typography component="p" className="mb-3">
            <span className="font-semibold">Mode:</span>{" "}
            <span className="text-foreground/60 capitalize">
              {product.mode.replace(/_/g, " ")}
            </span>
          </Typography>

          <Typography component="p" className="mb-6">
            <span className="font-semibold">Carrier:</span>{" "}
            <span className="text-foreground/60 capitalize">
              {product.carrier_status}
            </span>
          </Typography>

          {product.specifications?.length > 0 && (
            <div className="mb-6">
              <Typography variant="h4" className="mb-3">
                Specifications:
              </Typography>

              <div className="space-y-1">
                {product.specifications.map((spec, index) => (
                  <Typography
                    key={`${spec.key}-${index}`}
                    component="p"
                    className="text-sm"
                  >
                    <span className="font-medium capitalize">{spec.key}:</span>{" "}
                    <span className="text-foreground/60">{spec.value}</span>
                  </Typography>
                ))}
              </div>
            </div>
          )}

          <div>
            <ResubaleSheet
              title="Update Product"
              description="Update necessary product information here"
              open={open}
              onOpenChange={setOpen}
              trigger={
                <Button size="lg" className="w-auto text-base">
                  Edit Product
                </Button>
              }
            >
              <EditProductForm
                initialData={product}
                onSuccessAction={() => setOpen(false)}
              />
            </ResubaleSheet>
          </div>
        </div>
      </div>
    </section>
  );
}
