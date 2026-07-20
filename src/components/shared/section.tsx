import React from "react";

export function Section({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border overflow-hidden rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="size-4 text-gray-400" />}
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          </div>
          {description && (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function InfoRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span
        className={`min-w-0 text-right text-sm break-words text-gray-900 ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
