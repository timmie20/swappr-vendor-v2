"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  // Named in the toast, e.g. "Tracking number copied"
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={cn("size-7 text-gray-400 hover:text-gray-600", className)}
      title={`Copy ${label.toLowerCase()}`}
    >
      {copied ? (
        <Icons.check className="size-3.5 text-teal-600" />
      ) : (
        <Icons.copy className="size-3.5" />
      )}
      <span className="sr-only">Copy {label.toLowerCase()}</span>
    </Button>
  );
}
