"use client";

import React from "react";
import { notFound } from "next/navigation";

import AppBreadcrumb from "@/components/app-breadcrumbs";
import { useProduct } from "@/hooks/services/use-products";

import Details from "./details";
import { VariantTable } from "./component/table/variant-table";
import {
  ProductDetailsError,
  ProductDetailsSkeleton,
} from "./components/states";

export default function ProductDetailsPage({
  productId,
}: {
  productId: string;
}) {
  const { data, isLoading, isError, refetch } = useProduct(productId);
  const product = data?.product;

  if (!isLoading && !isError && !product) notFound();

  return (
    <React.Fragment>
      <AppBreadcrumb
        items={[
          { label: "Overview", href: "/overview" },
          { label: "Inventory", href: "/inventory" },
          { label: isLoading ? "..." : (product?.name ?? "") },
        ]}
      />

      <div className="mt-6">
        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : isError || !product ? (
          <ProductDetailsError onRetry={() => refetch()} />
        ) : (
          <div className="space-y-6">
            <Details product={product} />
            <VariantTable
              productId={productId}
              variants={product.variants ?? []}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
