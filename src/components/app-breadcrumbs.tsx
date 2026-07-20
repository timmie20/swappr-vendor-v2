import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * Max items to show before collapsing into an ellipsis dropdown.
   * When total items exceed this, the first and last `visibleEdgeCount`
   * items are shown, and the rest are collapsed.
   * Defaults to 4. Set to 0 to never collapse.
   */
  maxItems?: number;
  /**
   * How many items to keep visible on each edge when collapsing.
   * Defaults to 1.
   */
  visibleEdgeCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppBreadcrumb({
  items,
  maxItems = 4,
  visibleEdgeCount = 1,
}: AppBreadcrumbProps) {
  if (items.length === 0) return null;

  const shouldCollapse = maxItems > 0 && items.length > maxItems;

  // Items to show on the left edge (always visible)
  const leadItems = shouldCollapse ? items.slice(0, visibleEdgeCount) : [];
  // Items hidden inside the dropdown
  const hiddenItems = shouldCollapse
    ? items.slice(visibleEdgeCount, items.length - visibleEdgeCount)
    : [];
  // Items to show on the right edge (always visible)
  const tailItems = shouldCollapse
    ? items.slice(items.length - visibleEdgeCount)
    : [];

  // Flat list when not collapsing
  const flatItems = !shouldCollapse ? items : [];

  const renderItem = (
    item: BreadcrumbItem,
    index: number,
    arr: BreadcrumbItem[],
  ) => {
    const isLast = index === arr.length - 1;

    return (
      <React.Fragment key={`${item.label}-${index}`}>
        <BreadcrumbItem>
          {isLast || !item.href ? (
            <BreadcrumbPage className="font-medium text-gray-900">
              {item.label}
            </BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link
                href={item.href}
                className="text-gray-500 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    );
  };

  return (
    // Navigation chrome — never part of a page's printable content
    <Breadcrumb className="mb-4 print:hidden">
      <BreadcrumbList className="text-sm">
        {/* Non-collapsed render */}
        {flatItems.map((item, i) => renderItem(item, i, flatItems))}

        {/* Collapsed render */}
        {shouldCollapse && (
          <>
            {/* Lead items */}
            {leadItems.map((item, i) => (
              <React.Fragment key={`lead-${i}`}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="text-gray-500 transition-colors hover:text-gray-900"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            ))}

            {/* Ellipsis dropdown */}
            {hiddenItems.length > 0 && (
              <>
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="flex items-center gap-1 text-gray-400 transition-colors hover:text-gray-700"
                      aria-label="Show more breadcrumbs"
                    >
                      <BreadcrumbEllipsis className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {hiddenItems.map((item, i) => (
                        <DropdownMenuItem key={i} asChild>
                          {item.href ? (
                            <Link href={item.href}>{item.label}</Link>
                          ) : (
                            <span>{item.label}</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}

            {/* Tail items */}
            {tailItems.map((item, i) => (
              <React.Fragment key={`tail-${i}`}>
                <BreadcrumbItem>
                  {i === tailItems.length - 1 || !item.href ? (
                    <BreadcrumbPage className="font-medium text-gray-900">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="text-gray-500 transition-colors hover:text-gray-900"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i < tailItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
