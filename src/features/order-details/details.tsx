"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Package,
  MapPin,
  CreditCard,
  User,
  RefreshCw,
  Printer,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  DeliveryAddress,
  OrderBuyer,
  OrderDetails,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  VENDOR_UPDATABLE_STATUSES,
} from "../orders/types";

import { formatCurrency, formatDate, getInitials } from "@/helpers";
import { PAYMENT_BADGE_MAP, STATUS_BADGE_MAP } from "@/constants/order";

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = STATUS_BADGE_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant } = PAYMENT_BADGE_MAP[status] ?? {
    label: status,
    variant: "outline" as const,
  };
  return <Badge variant={variant}>{label}</Badge>;
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border overflow-hidden rounded-lg border bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({
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
        className={`text-right text-sm text-gray-900 ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function OrderTimeline({ order }: { order: OrderDetails }) {
  const steps: {
    label: string;
    date: string | undefined;
    done: boolean;
  }[] = [
    {
      label: "Order Placed",
      date: order.created_at,
      done: true,
    },
    {
      label: "Confirmed",
      date: order.confirmed_at ?? undefined,
      done: !!order.confirmed_at,
    },
    {
      label: "Shipped",
      date: order.shipped_at ?? undefined,
      done: !!order.shipped_at,
    },
    {
      label: "Delivered",
      date: order.delivered_at ?? undefined,
      done: !!order.delivered_at,
    },
  ];

  return (
    <div className="border-border rounded-lg border bg-white px-5 py-5">
      <div className="flex items-start gap-0 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const dateInfo = step.date ? formatDate(step.date) : null;
          return (
            <div key={step.label} className="flex min-w-0 flex-1 items-start">
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                    step.done
                      ? "border-teal-600 bg-teal-600"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div className="mt-2 px-1 text-center">
                  <p
                    className={`text-xs font-medium whitespace-nowrap ${
                      step.done ? "text-muted-foreground" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  {dateInfo ? (
                    <p className="text-muted-foreground mt-0.5 text-xs whitespace-nowrap">
                      {dateInfo.full}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-gray-300">—</p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={`mx-1 mt-3.5 h-0.5 flex-1 ${
                    step.done && steps[i + 1].done
                      ? "bg-teal-600"
                      : "bg-gray-100"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Order Items ──────────────────────────────────────────────────────────────

function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <Section title="Order Items" icon={Package}>
      <div className="-mx-5 -my-4 divide-y divide-gray-50">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50/50"
          >
            {/* Image */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-100">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.product_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-5 w-5 text-gray-300" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug font-medium">
                {item.product_name}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {item.color} {item.storage ? `• ${item.storage}GB` : ""}{" "}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Qty: {item.quantity}
              </p>
            </div>

            {/* Pricing */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(item.subtotal)}
              </p>
              {item.quantity && (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {formatCurrency(item.unit_price)} each
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal row */}
      <div className="border-border mt-4 flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground text-sm">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
        <span className="text-sm font-semibold">
          {formatCurrency(items.reduce((s, i) => s + Number(i.subtotal), 0))}
        </span>
      </div>
    </Section>
  );
}

// ─── Buyer Info ───────────────────────────────────────────────────────────────

function BuyerInfo({ buyer }: { buyer: OrderBuyer }) {
  return (
    <Section title="Buyer" icon={User}>
      <div className="mb-4 flex items-center gap-3">
        {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {buyer.avatar_url ? (
            <img
              src={buyer.avatar_url}
              alt={buyer.name}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(buyer.name)
          )}
        </div> */}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {buyer.first_name} {buyer.last_name}
          </p>
          <p className="text-xs text-gray-400">{buyer.email}</p>
        </div>
      </div>
    </Section>
  );
}

// ─── Delivery Info ────────────────────────────────────────────────────────────

function DeliveryInfo({
  address,
  contact_phone,
}: {
  address: DeliveryAddress;
  contact_phone: string;
}) {
  const full = [
    address.street,
    address.city,
    address.state,
    address.postal_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Section title="Delivery Address" icon={MapPin}>
      <p className="mb-3 text-sm leading-relaxed text-gray-700">{full}</p>
      <Separator className="mb-3" />
      <InfoRow label="Contact" value={contact_phone} />
    </Section>
  );
}

// ─── Payment Info ─────────────────────────────────────────────────────────────

function PaymentInfo({ order }: { order: OrderDetails }) {
  const expiresInfo = order.expires_at ? formatDate(order.expires_at) : null;

  return (
    <Section title="Payment" icon={CreditCard}>
      <div className="-my-1 divide-y divide-gray-50">
        <InfoRow
          label="Status"
          value={<PaymentStatusBadge status={order.payment_status} />}
        />
        <InfoRow
          label="Total"
          value={formatCurrency(order.total_amount)}
          valueClassName="font-semibold text-gray-900"
        />
        {/* <InfoRow
          label="Type"
          value={<OrderTypeBadge type={order.order_type} />}
        /> */}
        <InfoRow
          label="Reference"
          value={
            <span className="font-mono text-xs text-gray-500">
              {order.transaction_reference || "No reference"}
            </span>
          }
        />
        {order.payment_status === "unpaid" && expiresInfo && (
          <div className="flex items-center gap-2 py-3">
            <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <p className="text-xs text-amber-600">
              Expires {expiresInfo.relative}
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}

// ─── Status Management ────────────────────────────────────────────────────────

function StatusManagement({
  currentStatus,
  onUpdate,
  isPending,
}: {
  currentStatus: OrderStatus;
  onUpdate: (status: OrderStatus) => Promise<void>;
  isPending: boolean;
}) {
  const [selected, setSelected] = useState<OrderStatus>(currentStatus);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const hasChanged = selected !== currentStatus;

  const handleConfirm = async () => {
    await onUpdate(selected);
    setConfirmOpen(false);
  };

  return (
    <>
      <Section title="Update Status">
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs text-gray-400">Current status</p>
            <OrderStatusBadge status={currentStatus} />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400">Change to</p>
            <Select
              value={selected}
              onValueChange={(v) => setSelected(v as OrderStatus)}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 bg-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_UPDATABLE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
            disabled={!hasChanged || isPending}
            onClick={() => setConfirmOpen(true)}
          >
            {isPending ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </Section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm status update</DialogTitle>
            <DialogDescription>
              Change order status from{" "}
              <span className="font-medium text-gray-900">{currentStatus}</span>{" "}
              to <span className="font-medium text-gray-900">{selected}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      {/* Timeline */}
      <Skeleton className="h-24 w-full rounded-lg" />

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function OrderDetailsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-gray-900">
        Couldn't load order
      </h3>
      <p className="mb-5 max-w-xs text-sm text-gray-400">
        There was a problem fetching this order. Check your connection and try
        again.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}

// ─── Print Receipt ────────────────────────────────────────────────────────────

function PrintReceipt({ order }: { order: OrderDetails }) {
  return (
    <div className="hidden p-8 font-sans text-gray-900 print:block">
      {/* Branding */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Swappr</h1>
          <p className="mt-0.5 text-sm text-gray-500">Order Receipt</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold">{order.order_number}</p>
          <p className="mt-0.5 text-xs text-gray-400">
            {formatDate(order.created_at)?.full}
          </p>
        </div>
      </div>

      {/* Buyer */}
      <div className="mb-6">
        <h2 className="mb-2 text-xs font-medium tracking-widest text-gray-400 uppercase">
          Buyer
        </h2>
        <p className="text-sm font-medium">
          {order.buyer.first_name} {order.buyer.last_name}
        </p>
        <p className="text-sm text-gray-500">{order.buyer.email}</p>
        <p className="text-sm text-gray-500">{order.contact_phone}</p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="mb-3 text-xs font-medium tracking-widest text-gray-400 uppercase">
          Items
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              <th className="pb-2 font-medium text-gray-500">Product</th>
              <th className="pb-2 text-center font-medium text-gray-500">
                Qty
              </th>
              <th className="pb-2 text-right font-medium text-gray-500">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-2">
                  <p className="font-medium">{item.product_name}</p>
                  {item.color && (
                    <p className="text-xs text-gray-400">{item.color}</p>
                  )}
                </td>
                {item.storage && (
                  <td className="py-2 text-center text-gray-500">
                    {item.storage ? `${item.storage}GB` : "—"}
                  </td>
                )}
                <td className="py-2 text-center text-gray-500">
                  {item.quantity}
                </td>
                <td className="py-2 text-right font-medium">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td
                colSpan={2}
                className="pt-3 text-sm font-semibold text-gray-900"
              >
                Total
              </td>
              <td className="pt-3 text-right text-sm font-bold">
                {formatCurrency(order.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Payment */}
      <div className="border-t border-gray-100 pt-4 text-sm">
        <p className="text-gray-500">
          Payment status:{" "}
          <span className="font-medium text-gray-900">
            {order.payment_status}
          </span>
        </p>
        {order.transaction_reference && (
          <p className="mt-1 text-gray-500">
            Reference:{" "}
            <span className="font-mono text-xs">
              {order.transaction_reference}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface OrderDetailsPageProps {
  order: OrderDetails | null;
  isLoading: boolean;
  isError: boolean;
  onRefresh: () => void;
  onUpdateStatus?: (status: OrderStatus) => Promise<void>;
  isUpdatingStatus?: boolean;
}

export default function Details({
  order,
  isLoading,
  isError,
  onRefresh,
  onUpdateStatus,
  isUpdatingStatus,
}: OrderDetailsPageProps) {
  const handlePrint = () => window.print();

  if (isLoading) return <OrderDetailsSkeleton />;
  if (isError || !order) return <OrderDetailsError onRetry={onRefresh} />;

  const showSwapInfo =
    order.order_type === "swap" || order.order_type === "purchase";

  return (
    <>
      {/* Print-only receipt */}
      <PrintReceipt order={order} />

      {/* Main content — hidden when printing */}
      <div className="space-y-6 print:hidden">
        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-gray-900">
              Order Number{" "}
              <span className="text-muted-foreground">
                #{order.order_number}
              </span>
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.payment_status} />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {order.payment_status === "paid" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-9 gap-2 text-gray-600"
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print Receipt</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-9 w-9 p-0 text-gray-400"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Timeline ── */}
        <OrderTimeline order={order} />

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left — primary content */}
          <div className="space-y-6">
            <OrderItemsList items={order.items} />
          </div>

          {/* Right — sidebar cards */}
          <div className="space-y-4">
            <PaymentInfo order={order} />
            <BuyerInfo buyer={order.buyer} />
            <DeliveryInfo
              address={order.delivery_address}
              contact_phone={order.contact_phone}
            />
            {/* {showSwapInfo && order.swap_device && (
              <SwapInfo device={order.swap_device} />
            )} */}
            {/* <StatusManagement
              currentStatus={order.status}
              onUpdate={onUpdateStatus}
              isPending={isUpdatingStatus}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
