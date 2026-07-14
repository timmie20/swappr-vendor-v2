"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/shared/icons";
import { useTogglePickup } from "@/hooks/services/use-vendor";
import { getInspectionState } from "@/features/inspection/lib";
import { RequestInspectionDialog } from "@/features/inspection/components/request-inspection-dialog";
import type { VendorProfile } from "@/types/auth";
import { Section } from "./section";

function SettingRow({
  id,
  title,
  hint,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string;
  title: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium text-gray-900"
        >
          {title}
        </label>
        <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
          {hint}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        className="mt-0.5"
      />
    </div>
  );
}

const INSPECTION_STATUS: Record<
  "not_requested" | "pending",
  { label: string; hint: string }
> = {
  not_requested: {
    label: "Inspection needed",
    hint: "Pickup needs a one-time Swappr store inspection. Flip the switch to request one.",
  },
  pending: {
    label: "Inspection in progress",
    hint: "Swappr will be in touch to confirm your store location. Pickup unlocks once your store is verified.",
  },
};

export function SettingsCard({ profile }: { profile: VendorProfile }) {
  const { mutate: togglePickup, isPending } = useTogglePickup();
  const [dialogOpen, setDialogOpen] = useState(false);

  const inspection = getInspectionState(profile);

  const onPickupChange = (checked: boolean) => {
    // Disabling is always allowed; enabling requires a verified inspection —
    // intercept with the explainer dialog instead of letting the API 403
    if (checked && inspection !== "verified") {
      if (inspection === "not_requested") setDialogOpen(true);
      return;
    }
    togglePickup(checked);
  };

  return (
    <Section
      title="Store settings"
      icon={Icons.settings}
      description="Control how buyers interact with your store."
    >
      <SettingRow
        id="pickup_enabled"
        title="Store pickup"
        hint="Let buyers choose to pick up their orders from your store at checkout, instead of paying for delivery. Your store address and operating hours are shown to them."
        checked={inspection === "verified" && !!profile.pickup_enabled}
        disabled={isPending || inspection === "pending"}
        onCheckedChange={onPickupChange}
      />

      {inspection === "verified" ? (
        <p className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-medium">
          <Icons.shieldCheck className="size-3.5" />
          Store verified for pickup
        </p>
      ) : (
        <div className="mt-3 space-y-1.5">
          <Badge variant="outline" className="gap-1">
            <Icons.mapPin className="size-3" />
            {INSPECTION_STATUS[inspection].label}
          </Badge>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {INSPECTION_STATUS[inspection].hint}
          </p>
        </div>
      )}

      <RequestInspectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Section>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="shrink-0 text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm text-gray-900">{value ?? "—"}</span>
    </div>
  );
}

export function PayoutCard({ profile }: { profile: VendorProfile }) {
  return (
    <Section
      title="Payout details"
      icon={Icons.billing}
      description="Where your earnings are paid out."
    >
      <div className="-my-1 divide-y divide-gray-50">
        <InfoRow label="Bank" value={profile.bank_name || "—"} />
        <InfoRow label="Account name" value={profile.account_name || "—"} />
      </div>
      <Separator className="my-3" />
      <p className="text-muted-foreground text-xs leading-relaxed">
        Payout details are verified during onboarding and can't be edited here.
        Contact swappr support if you need to change.
      </p>
    </Section>
  );
}

export function AccountOwnerCard({ profile }: { profile: VendorProfile }) {
  const fullName = [profile.user?.first_name, profile.user?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <Section
      title="Account owner"
      icon={Icons.user}
      description="The person who manages this store."
    >
      <div className="-my-1 divide-y divide-gray-50">
        {fullName && <InfoRow label="Name" value={fullName} />}
        <InfoRow label="Email" value={profile.user?.email} />
        <InfoRow
          label="Email verified"
          value={
            profile.user?.email_verified ? (
              <span className="text-primary inline-flex items-center gap-1 font-medium">
                <Icons.shieldCheck className="size-3.5" /> Verified
              </span>
            ) : (
              "Not verified"
            )
          }
        />
      </div>
    </Section>
  );
}
