"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormDatePicker } from "@/components/forms/form-date-picker";
import { FormTimePicker } from "@/components/forms/form-time-picker";
import { STATUS_BADGE_MAP } from "@/constants/badge";
import { useUpdateOrderStatus } from "@/hooks/services/use-orders";
import {
  deliveryFulfillmentSchema,
  type DeliveryFulfillmentInput,
  pickupFulfillmentSchema,
  type PickupFulfillmentInput,
} from "@/schemas/orders";
import {
  ESTIMATED_ARRIVAL_LABELS,
  FulfillmentType,
  getNextOrderStatus,
  type Order,
  type OrderDetails,
  OrderStatus,
} from "../types";

const ESTIMATED_ARRIVAL_OPTIONS = Object.entries(ESTIMATED_ARRIVAL_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const FULFILLMENT_FORM_ID = "fulfillment-form";

function DeliveryFulfillmentForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (values: DeliveryFulfillmentInput) => void;
  isPending: boolean;
}) {
  const form = useForm<DeliveryFulfillmentInput>({
    resolver: zodResolver(deliveryFulfillmentSchema),
    defaultValues: {
      rider_name: "",
      rider_phone: "",
      delivery_fee: undefined,
      estimated_arrival: undefined,
    },
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form id={FULFILLMENT_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="rider_name"
            label="Rider name"
            placeholder="e.g. John Doe"
            required
            disabled={isPending}
          />
          <FormInput
            control={form.control}
            name="rider_phone"
            label="Rider phone"
            type="tel"
            placeholder="e.g. 08012345678"
            required
            disabled={isPending}
          />
          <FormInput
            control={form.control}
            name="delivery_fee"
            label="Delivery fee (NGN)"
            type="number"
            placeholder="e.g. 1500"
            required
            disabled={isPending}
          />
          <FormSelect
            control={form.control}
            name="estimated_arrival"
            label="Estimated arrival"
            placeholder="Select a window"
            options={ESTIMATED_ARRIVAL_OPTIONS}
            required
            disabled={isPending}
          />
        </FieldGroup>
      </form>
    </Form>
  );
}

function PickupFulfillmentForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (values: PickupFulfillmentInput) => void;
  isPending: boolean;
}) {
  const form = useForm<PickupFulfillmentInput>({
    resolver: zodResolver(pickupFulfillmentSchema),
    defaultValues: {
      pickup_date: "",
      pickup_time_from: "",
      pickup_time_to: "",
    },
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form id={FULFILLMENT_FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormDatePicker
            control={form.control}
            name="pickup_date"
            label="Pickup date"
            required
            disabled={isPending}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormTimePicker
              control={form.control}
              name="pickup_time_from"
              label="From"
              placeholder="e.g. 10:00"
              required
              disabled={isPending}
            />
            <FormTimePicker
              control={form.control}
              name="pickup_time_to"
              label="To"
              placeholder="e.g. 12:00"
              required
              disabled={isPending}
            />
          </div>
        </FieldGroup>
      </form>
    </Form>
  );
}

interface AdvanceStatusDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvanceStatusDialog({
  order,
  open,
  onOpenChange,
}: AdvanceStatusDialogProps) {
  const [resultCode, setResultCode] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const { mutateAsync, isPending } = useUpdateOrderStatus();

  useEffect(() => {
    if (open) setResultCode(null);
  }, [open]);

  const nextStatus = order ? getNextOrderStatus(order.status) : null;

  if (!order || !nextStatus) return null;

  // Missing fulfillment data falls back to a plain confirm — shouldn't
  // happen in practice, but avoids stranding the vendor on a dead submit
  // button wired to a fulfillment form id that was never rendered.
  const fulfillmentType = order.fulfillment?.fulfillment_type;
  const requiresFulfillmentForm =
    nextStatus === OrderStatus.SHIPPED && !!fulfillmentType;

  const applyResult = (updated: OrderDetails) => {
    if (nextStatus === OrderStatus.SHIPPED) {
      setResultCode(
        fulfillmentType === FulfillmentType.PICKUP
          ? {
              label: "Pickup code",
              value: updated.fulfillment?.pickup_code ?? "—",
            }
          : {
              label: "Tracking number",
              value: updated.tracking_number ?? "—",
            },
      );
    } else {
      onOpenChange(false);
    }
  };

  const handleSimpleConfirm = async () => {
    const { order: updated } = await mutateAsync({
      id: order.id,
      status: nextStatus,
    });
    applyResult(updated);
  };

  const handleFulfillmentSubmit = async (
    values: DeliveryFulfillmentInput | PickupFulfillmentInput,
  ) => {
    const { order: updated } = await mutateAsync({
      id: order.id,
      status: nextStatus,
      ...values,
    });
    applyResult(updated);
  };

  const currentBadge = STATUS_BADGE_MAP[order.status];
  const nextBadge = STATUS_BADGE_MAP[nextStatus];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm"
        onInteractOutside={(event) => {
          // timepicker-ui renders its clock popup by appending directly to
          // document.body, outside this DialogContent's DOM subtree, so
          // Radix sees clicks on it as "outside" and closes (unmounts) the
          // dialog. Ignore interactions that land inside that popup.
          const target = event.target as HTMLElement | null;
          if (target?.closest(".tp-ui-modal")) {
            event.preventDefault();
          }
        }}
      >
        {resultCode ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Order marked as {nextBadge.label.toLowerCase()}
              </DialogTitle>
              <DialogDescription>
                Share this {resultCode.label.toLowerCase()} with the buyer.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/40 flex items-center justify-between rounded-md border px-3 py-2">
              <div>
                <p className="text-muted-foreground text-xs">
                  {resultCode.label}
                </p>
                <p className="font-mono text-sm font-semibold">
                  {resultCode.value}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(resultCode.value)}
              >
                Copy
              </Button>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Update order status</DialogTitle>
              <DialogDescription asChild>
                <span className="flex items-center gap-2 pt-1">
                  <Badge variant={currentBadge.variant}>
                    {currentBadge.label}
                  </Badge>
                  <span>&rarr;</span>
                  <Badge variant={nextBadge.variant}>{nextBadge.label}</Badge>
                </span>
              </DialogDescription>
            </DialogHeader>

            {requiresFulfillmentForm &&
              fulfillmentType === FulfillmentType.DELIVERY && (
                <DeliveryFulfillmentForm
                  onSubmit={handleFulfillmentSubmit}
                  isPending={isPending}
                />
              )}
            {requiresFulfillmentForm &&
              fulfillmentType === FulfillmentType.PICKUP && (
                <PickupFulfillmentForm
                  onSubmit={handleFulfillmentSubmit}
                  isPending={isPending}
                />
              )}

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type={requiresFulfillmentForm ? "submit" : "button"}
                form={requiresFulfillmentForm ? FULFILLMENT_FORM_ID : undefined}
                onClick={
                  requiresFulfillmentForm ? undefined : handleSimpleConfirm
                }
                disabled={isPending}
              >
                {isPending && <Spinner className="mr-2" />}
                Confirm
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
