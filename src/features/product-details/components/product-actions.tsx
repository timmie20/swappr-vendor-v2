"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ResubaleSheet from "@/components/resuable-sheet";
import EditProductForm from "@/features/inventory/component/edit-product-form";
import { useToggleProductPublish } from "@/hooks/services/use-products";
import { Product } from "@/features/inventory/types";
import { Icons } from "@/components/shared/icons";

export function ProductActions({ product }: { product: Product }) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: togglePublish, isPending: isToggling } =
    useToggleProductPublish();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResubaleSheet
        title="Update Product"
        description="Update necessary product information here"
        open={editOpen}
        onOpenChange={setEditOpen}
        trigger={
          <Button size="sm" className="gap-2">
            <Pencil className="size-3.5" />
            Edit Product
          </Button>
        }
      >
        <EditProductForm
          initialData={product}
          onSuccessAction={() => setEditOpen(false)}
        />
      </ResubaleSheet>

      <Button
        variant={product.is_active ? "destructive" : "outline"}
        size="sm"
        disabled={isToggling || !product.id}
        onClick={() =>
          togglePublish({ id: product.id!, is_active: !product.is_active })
        }
      >
        {isToggling ? (
          <Spinner className="mr-1" />
        ) : (
          <Icons.power className="mr-1" />
        )}
        {product.is_active ? "Unpublish" : "Publish"}
      </Button>
    </div>
  );
}
