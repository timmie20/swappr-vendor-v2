import React from "react";

export function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border overflow-hidden rounded-lg border bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-gray-400" />}
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
