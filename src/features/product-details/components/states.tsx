import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero card: gallery + summary */}
      <div className="border-border rounded-lg border bg-white p-5">
        <div className="flex flex-col gap-6 md:flex-row lg:gap-8">
          <div className="mx-auto w-full max-w-80 shrink-0 space-y-3 md:mx-0 md:w-64 xl:w-80">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="size-14 rounded-md" />
              <Skeleton className="size-14 rounded-md" />
              <Skeleton className="size-14 rounded-md" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-16 w-full max-w-prose" />
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-56 w-full rounded-lg" />
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>

      {/* Variants table */}
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export function ProductDetailsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="size-5 text-red-500" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-900">
        Couldn&apos;t load product
      </h3>
      <p className="mb-5 max-w-xs text-sm text-gray-400">
        There was a problem fetching this product. Check your connection and
        try again.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RotateCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}
