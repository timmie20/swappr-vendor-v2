"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useVerifyBusiness } from "@/hooks/services/use-onboarding-mutation";
import {
  VerifyBusinessInput,
  verifyBusinessSchema,
} from "@/schemas/onboarding";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { SubmitButton } from "@/components/forms/submit-button";

const COMPANY_TYPE_OPTIONS = [
  { value: "RC", label: "Limited liability company (RC)" },
  { value: "BN", label: "Business name (BN)" },
  { value: "IT", label: "Incorporated trustee (IT)" },
];

export function VerifyBusinessForm() {
  const form = useForm<VerifyBusinessInput>({
    resolver: zodResolver(verifyBusinessSchema),
    defaultValues: { rc_number: "" },
  });

  const { mutate, isPending } = useVerifyBusiness();

  const onSubmit = (values: VerifyBusinessInput) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <FormSelect
            label="Company Registration type"
            control={form.control}
            name="company_type"
            options={COMPANY_TYPE_OPTIONS}
            placeholder="Select how your business is registered"
          />

          <FormInput
            control={form.control}
            name="rc_number"
            label="CAC registration number"
            placeholder="e.g. 1234567"
            required
          />
        </FieldGroup>

        <Field orientation="horizontal">
          <SubmitButton
            isLoading={isPending}
            disabled={isPending}
            loadingText="Verifying..."
          >
            Verify business
          </SubmitButton>
        </Field>
      </form>
    </Form>
  );
}
