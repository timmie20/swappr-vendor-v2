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
  const { data, isLoading, isError, refetch } = useOrderDetails(orderNumber);
  // const { mutateAsync, isPending } = useUpdateOrderStatus(params.orderNumber);

  return (
    <React.Fragment>
      <AppBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Orders", href: "/orders" },
          { label: `Order #${orderNumber}` },
        ]}
      />

      <Details
        order={data?.data ?? null}
        isLoading={isLoading}
        isError={isError}
        onRefresh={refetch}
        // onUpdateStatus={mutateAsync}
        // isUpdatingStatus={isPending}
      />
    </React.Fragment>
  );
}
