"use client";

import React, { useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AccountProfileInput,
  accountProfileSchema,
  UpdateVendorProfilePayload,
} from "@/schemas/vendor";
import { useUpdateVendorProfile } from "@/hooks/services/use-vendor";
import { getChangedFieldsExcluding } from "@/helpers/format";
import { notify } from "@/helpers/notify";
import type { VendorProfile } from "@/types/auth";
import { Section } from "./section";
import { Icons } from "@/components/shared/icons";

function profileToFormValues(profile: VendorProfile): AccountProfileInput {
  return {
    business_name: profile.business_name ?? "",
    trading_name: profile.trading_name ?? "",
    contact_number: profile.contact_number ?? "",
    contact_email: profile.contact_email ?? "",
    business_address: profile.business_address ?? "",
    state: profile.state ?? "",
    city: profile.city ?? "",
    landmark: profile.landmark ?? "",
    description: profile.description ?? "",
  };
}

export function ProfileForm({ profile }: { profile: VendorProfile }) {
  const defaultValues = useMemo(() => profileToFormValues(profile), [profile]);

  const form = useForm<AccountProfileInput>({
    resolver: zodResolver(accountProfileSchema),
    values: defaultValues, // keeps the form in sync when the query refetches
  });

  const { mutate, isPending } = useUpdateVendorProfile(profile.id);

  // Held here while the address-change warning dialog is open
  const [pendingSave, setPendingSave] = useState<{
    payload: UpdateVendorProfilePayload;
    values: AccountProfileInput;
  } | null>(null);

  // The address input stays locked until the vendor deliberately unlocks it —
  // changing it is sensitive (resets inspection verification & pickup)
  const [addressUnlocked, setAddressUnlocked] = useState(false);

  const onAddressLockChange = (unlocked: boolean) => {
    setAddressUnlocked(unlocked);
    // Re-locking discards any edit so a half-typed address can't ride along
    // with an unrelated save
    if (!unlocked) form.resetField("business_address");
  };

  const save = (payload: UpdateVendorProfilePayload, values: AccountProfileInput) =>
    mutate(payload, {
      onSuccess: () => {
        form.reset(values);
        setAddressUnlocked(false); // back to the locked default after any save
      },
    });

  const onSubmit = (values: AccountProfileInput) => {
    const payload: UpdateVendorProfilePayload = getChangedFieldsExcluding(
      defaultValues,
      values,
      ["business_name"], // locked to the CAC record — backend rejects it
    );

    if (Object.keys(payload).length === 0) {
      notify.info("No changes to save");
      return;
    }

    // Changing the address silently resets inspection verification and turns
    // pickup off — warn before saving if there's anything to lose
    const addressChanged = "business_address" in payload;
    const hasInspectionProgress =
      profile.is_inspection_verified || profile.inspection_requested_at;

    if (addressChanged && hasInspectionProgress) {
      setPendingSave({ payload, values });
      return;
    }

    save(payload, values);
  };

  const confirmAddressChange = () => {
    if (!pendingSave) return;
    save(pendingSave.payload, pendingSave.values);
    setPendingSave(null);
  };

  const { isDirty } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Section
          title="Business information"
          icon={Icons.store}
          description="How your store shows up to buyers across Swappr."
        >
          <FieldGroup>
            <FormInput
              control={form.control}
              name="business_name"
              label="Registered business name"
              disabled
              description="Locked to your CAC registration — set a trading name to display a different store name."
            />
            <FormInput
              control={form.control}
              name="trading_name"
              label="Trading name"
              placeholder={profile.business_name ?? "Your store's display name"}
              description="The name buyers see across Swappr."
            />
            <FormInput
              control={form.control}
              name="contact_number"
              label="Contact number"
              type="tel"
              placeholder="e.g. +2348012345678"
            />
            <FormInput
              control={form.control}
              name="contact_email"
              label="Contact email"
              type="email"
              placeholder="e.g. hello@yourstore.com"
            />
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 rounded-md border border-dashed px-3 py-2.5">
                <div className="min-w-0">
                  <label
                    htmlFor="unlock_business_address"
                    className="cursor-pointer text-sm font-medium text-gray-900"
                  >
                    Edit business address
                  </label>
                  <p className="mt-0.5 text-xs leading-relaxed text-amber-700">
                    Sensitive — changing your address resets your store&apos;s
                    pickup verification, and pickup stays off until Swappr
                    inspects the new location.
                  </p>
                </div>
                <Switch
                  id="unlock_business_address"
                  checked={addressUnlocked}
                  onCheckedChange={onAddressLockChange}
                  className="mt-0.5"
                />
              </div>
              <FormInput
                control={form.control}
                name="business_address"
                label="Business address"
                placeholder="Your business address"
                disabled={!addressUnlocked}
              />
            </div>
          </FieldGroup>
        </Section>

        <Section
          title="Location"
          icon={Icons.mapPin}
          description="Helps buyers nearby find and get to your store."
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                control={form.control}
                name="state"
                label="State"
                placeholder="e.g. Lagos"
              />
              <FormInput
                control={form.control}
                name="city"
                label="City"
                placeholder="e.g. Ikeja"
              />
            </div>
            <FormInput
              control={form.control}
              name="landmark"
              label="Landmark"
              placeholder="e.g. Opposite First Bank, Computer Village"
            />
          </FieldGroup>
        </Section>

        <Section
          title="Store details"
          icon={Icons.edit}
          description="Tell buyers what you sell and why they should buy from you."
        >
          <FormTextarea
            control={form.control}
            name="description"
            label="Store description"
            placeholder="What do you sell, and what makes your store worth buying from?"
            config={{ maxLength: 900 }}
          />
        </Section>

        {/* Sticky-feeling action row — only meaningful when something changed */}
        <div className="flex items-center justify-end gap-3">
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset(defaultValues);
                setAddressUnlocked(false);
              }}
              disabled={isPending}
            >
              Discard changes
            </Button>
          )}
          <SubmitButton
            type="submit"
            isLoading={isPending}
            disabled={!isDirty}
            loadingText="Saving..."
            className="w-auto px-6"
          >
            Save changes
          </SubmitButton>
        </div>
      </form>

      <AlertDialog
        open={pendingSave !== null}
        onOpenChange={(open) => !open && setPendingSave(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Changing your address resets pickup verification
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-1">
                <p>
                  Your store{" "}
                  {profile.is_inspection_verified
                    ? "was inspected and verified"
                    : "has an inspection request in progress"}{" "}
                  at its current address. Saving a new address will reset that
                  verification and turn store pickup off.
                </p>
                <p>
                  Buyers won&apos;t be able to choose pickup again until Swappr
                  inspects your new location — you can request a new inspection
                  from your store settings after saving.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep current address</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmAddressChange}>
              Save new address
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
