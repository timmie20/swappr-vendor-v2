"use client";

import { Button } from "@/components/ui/button";

/** Inline per-section error state — one failed query never takes down the page */
export function SectionRetry({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <p className="text-muted-foreground text-sm">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
