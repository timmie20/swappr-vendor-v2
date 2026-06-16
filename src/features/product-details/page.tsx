"use client";

import React from "react";
import { notFound } from "next/navigation";

import AppBreadcrumb from "@/components/app-breadcrumbs";
import { Button } from "@/components/ui/button";

import {
  useProduct,
  useToggleProductPublish,
} from "@/hooks/services/use-products";
import Details from "./details";
import { VariantTable } from "./component/table/variant-table";
import { Product } from "../inventory/types";
import { Spinner } from "@/components/ui/spinner";

export default function ProductDetailsPage({
  productId,
}: {
  productId: string;
}) {
  const { data, isLoading, isError } = useProduct(productId);

  const { mutate: togglePublish, isPending: isToggling } =
    useToggleProductPublish();

  const product = data?.product;

  if (isError) notFound();

  if (!isLoading && !product) notFound();

  return (
    <React.Fragment>
      <div className="mb-6 flex items-center justify-between gap-4">
        <AppBreadcrumb
          items={[
            { label: "Overview", href: "/overview" },
            { label: "Inventory", href: "/inventory" },
            { label: isLoading ? "Loading..." : `${data?.product.name}` },
          ]}
        />

        <Button
          variant={product?.is_active ? "outline" : "destructive"}
          size="sm"
          className="cursor-pointer"
          onClick={() =>
            togglePublish({
              id: productId || "",
              is_active: !product?.is_active,
            })
          }
          disabled={isToggling}
        >
          {isToggling ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> Updating...
            </span>
          ) : product?.is_active ? (
            "Unpublish Product"
          ) : (
            "Publish Product"
          )}
        </Button>
      </div>

      <Details product={product as Product} />

      <div className="mt-8">
        <VariantTable
          productId={productId}
          variants={data?.product.variants ?? []}
          isLoading={isLoading}
        />
      </div>
    </React.Fragment>
  );
}
