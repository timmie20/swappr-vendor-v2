"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
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
    contact_number: profile.contact_number ?? "",
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

  const { mutate, isPending } = useUpdateVendorProfile();

  const onSubmit = (values: AccountProfileInput) => {
    const payload: UpdateVendorProfilePayload = getChangedFieldsExcluding(
      defaultValues,
      values,
      ["business_address"],
    );

    if (Object.keys(payload).length === 0) {
      notify.info("No changes to save");
      return;
    }

    mutate(payload, { onSuccess: () => form.reset(values) });
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
              label="Business name"
              placeholder="Your store name"
              required
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
              name="business_address"
              label="Business address"
              disabled
              description="Your registered address can't be changed here — contact support to update it."
            />
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
              onClick={() => form.reset(defaultValues)}
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
    </Form>
  );
}
