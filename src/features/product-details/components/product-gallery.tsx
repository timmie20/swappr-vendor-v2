"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="w-full space-y-3">
      <div className="border-border relative aspect-square w-full overflow-hidden rounded-xl border bg-gray-50">
        <Image
          src={activeImage || "/placeholder.png"}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 320px"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative size-14 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                i === activeIndex
                  ? "border-teal-600"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${i + 1} of ${name}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
