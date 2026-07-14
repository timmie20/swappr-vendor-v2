"use client";

import { useMemo } from "react";
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormInput } from "@/components/forms/form-input";
import { FormTimePicker } from "@/components/forms/form-time-picker";
import {
  CompleteProfileInput,
  CompleteProfilePayload,
  completeProfileSchema,
  DAYS_OF_WEEK,
} from "@/schemas/onboarding";
import { useCompleteProfile } from "@/hooks/services/use-onboarding-mutation";
import { SubmitButton } from "@/components/forms/submit-button";
import { FormTextarea } from "@/components/forms/form-textarea";
import { getChangedFieldsExcluding } from "@/helpers/format";
import type { VendorProfile } from "@/types/auth";

const DAY_LABELS: Record<(typeof DAYS_OF_WEEK)[number], string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

function OperatingDaysField({
  control,
}: {
  control: ReturnType<typeof useForm<CompleteProfileInput>>["control"];
}) {
  const { field, fieldState } = useController({
    control,
    name: "operating_hours.days",
  });

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel htmlFor="operating_hours.days">Open on</FieldLabel>
        <ToggleGroup
          id="operating_hours.days"
          type="multiple"
          variant="outline"
          value={field.value}
          onValueChange={field.onChange}
          className="flex-wrap justify-start"
        >
          {DAYS_OF_WEEK.map((day) => (
            <ToggleGroupItem key={day} value={day} aria-label={day}>
              {DAY_LABELS[day]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} className="text-xs" />
        )}
      </FieldContent>
    </Field>
  );
}

export function CompleteProfileForm({ profile }: { profile: VendorProfile }) {
  // Prembly-provided values from verify-business — the review screen prefills
  // from these; anything left unchanged is simply not sent
  const defaultValues = useMemo<CompleteProfileInput>(
    () => ({
      contact_number: profile.contact_number ?? "",
      trading_name: profile.trading_name ?? "",
      business_address: profile.business_address ?? "",
      state: profile.state ?? "",
      city: profile.city ?? "",
      description: profile.description ?? "",
      landmark: profile.landmark ?? "",
      operating_hours: { days: [], open_time: "", close_time: "" },
    }),
    [profile],
  );

  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues,
  });

  const { mutate, isPending } = useCompleteProfile();

  const onSubmit = (values: CompleteProfileInput) => {
    // Send only overrides: an untouched field keeps the Prembly/CAC value,
    // and "" (cleared or never filled) also means "accept as-is"
    const changed = getChangedFieldsExcluding(defaultValues, values, [
      "contact_number",
      "operating_hours",
    ]);
    const overrides = Object.fromEntries(
      Object.entries(changed).filter(([, value]) => value !== ""),
    );

    const payload: CompleteProfilePayload = {
      contact_number: values.contact_number,
      ...overrides,
      // Validation guarantees hours are either fully set or fully empty
      ...(values.operating_hours.days.length > 0
        ? { operating_hours: values.operating_hours }
        : {}),
    };

    mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          {/* Locked to the CAC record — the backend rejects business_name here */}
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="business_name">
                Registered business name
              </FieldLabel>
              <Input
                id="business_name"
                value={profile.business_name ?? ""}
                disabled
                readOnly
              />
              <FieldDescription>
                From your CAC registration — this can’t be changed. Set a
                trading name below to display a different store name.
              </FieldDescription>
            </FieldContent>
          </Field>

          <FormInput
            control={form.control}
            name="trading_name"
            label="Trading name"
            placeholder={profile.business_name ?? "Your store's display name"}
            description="The name buyers see. Leave empty to use your registered name."
          />

          <FormInput
            control={form.control}
            name="contact_number"
            label="Contact number"
            type="tel"
            placeholder="e.g. 08012345678"
            required
          />

          <FormInput
            control={form.control}
            name="business_address"
            label="Business address"
            placeholder="Your business address"
          />

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

          <FormTextarea
            control={form.control}
            name="description"
            label="Store description"
            placeholder="What do you sell, and what makes your store worth buying from?"
          />
          <FormInput
            control={form.control}
            name="landmark"
            label="Landmark"
            placeholder="e.g. Opposite First Bank, Computer Village"
          />

          <OperatingDaysField control={form.control} />

          <div className="grid grid-cols-2 gap-4">
            <FormTimePicker
              control={form.control}
              name="operating_hours.open_time"
              label="Opens at"
              placeholder="e.g. 09:00"
            />
            <FormTimePicker
              control={form.control}
              name="operating_hours.close_time"
              label="Closes at"
              placeholder="e.g. 18:00"
            />
          </div>
        </FieldGroup>

        <Field orientation="horizontal">
          <SubmitButton
            type="submit"
            disabled={isPending}
            loadingText="Saving..."
            className="w-full"
          >
            Save and continue
          </SubmitButton>
        </Field>
      </form>
    </Form>
  );
}
