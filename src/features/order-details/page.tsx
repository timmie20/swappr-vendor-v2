"use client";

import { useOrderDetails } from "@/hooks/services/use-orders";
import Details from "./details";
import React from "react";
import AppBreadcrumb from "@/components/app-breadcrumbs";

export default function OrderDetailsPage({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const { data, isLoading, isError, isFetching, refetch } =
    useOrderDetails(orderNumber);

  return (
    <React.Fragment>
      <AppBreadcrumb
        items={[
          { label: "Overview", href: "/overview" },
          { label: "Orders", href: "/orders" },
          { label: `Order #${orderNumber}` },
        ]}
      />

      <Details
        order={data?.data ?? null}
        isLoading={isLoading}
        isError={isError}
        onRefresh={refetch}
        isRefreshing={isFetching && !isLoading}
      />
    </React.Fragment>
  );
}
