"use client";

import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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

export function CompleteProfileForm() {
  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      description: "",
      landmark: "",
      operating_hours: { days: [], open_time: "", close_time: "" },
    },
  });

  const { mutate, isPending } = useCompleteProfile();

  const onSubmit = (values: CompleteProfileInput) => {
    // Strip untouched optional fields rather than send "" / empty hours —
    // the backend treats every complete-profile field as optional
    const { operating_hours, description, landmark } = values;

    const payload: CompleteProfilePayload = {
      ...(description ? { description } : {}),
      ...(landmark ? { landmark } : {}),
      // Validation guarantees hours are either fully set or fully empty
      ...(operating_hours.days.length > 0 ? { operating_hours } : {}),
    };

    mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
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
