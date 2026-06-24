"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import {
  CompleteProfileInput,
  completeProfileSchema,
} from "@/schemas/onboarding";
import { useCompleteProfile } from "@/hooks/services/use-onboarding-mutation";
import { SubmitButton } from "@/components/forms/submit-button";
import { FormTextarea } from "@/components/forms/form-textarea";

export function CompleteProfileForm() {
  const form = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      description: "",
      operating_hours: "",
      landmark: "",
      business_address: "",
    },
  });

  const { mutate, isPending } = useCompleteProfile();

  const onSubmit = (values: CompleteProfileInput) => {
    // Strip empty optional fields rather than send "" — an explicit empty
    // string for business_address could be read as "clear the Prembly
    // address", which is never the intent of leaving a field untouched.
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== ""),
    ) as CompleteProfileInput;

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
            name="business_address"
            label="Business address"
            placeholder="Confirm or update your registered address"
          />
          <FormInput
            control={form.control}
            name="landmark"
            label="Landmark"
            placeholder="e.g. Opposite First Bank, Computer Village"
          />
          <FormInput
            control={form.control}
            name="operating_hours"
            label="Operating hours"
            placeholder="e.g. Mon–Sat, 9am–6pm"
          />
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
