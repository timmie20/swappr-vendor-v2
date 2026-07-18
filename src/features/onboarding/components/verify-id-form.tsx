"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import {
  useVerifyBvn,
  useVerifyNin,
} from "@/hooks/services/use-onboarding-mutation";
import { IdMethod, verifyId, VerifyIdInput } from "@/schemas/onboarding";
import { useState } from "react";
import { IdMethodToggle } from "./id-method-toggle";
import { SubmitButton } from "@/components/forms/submit-button";

export function VerifyIdForm() {
  const [method, setMethod] = useState<IdMethod>("bvn");

  const form = useForm<VerifyIdInput>({
    resolver: zodResolver(verifyId),
    defaultValues: { number: "" },
  });
  const { mutate, isPending } = useVerifyBvn();

  const { mutate: mutateNin, isPending: isPendingNin } = useVerifyNin();

  const onSubmit = (values: VerifyIdInput) => {
    if (method === "bvn") {
      mutate(values);
    } else {
      mutateNin(values);
    }
  };

  return (
    <Form {...form}>
      <IdMethodToggle value={method} onChange={setMethod} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <FieldGroup>
          <FormInput
            control={form.control}
            name="number"
            label={`Enter your ${method.toUpperCase()} number`}
            placeholder={`11-digits ${method.toUpperCase()} number`}
            required
          />
        </FieldGroup>
        <Field orientation="horizontal">
          <SubmitButton
            isLoading={isPending || isPendingNin}
            disabled={isPending || isPendingNin}
            loadingText="Verifying..."
          >
            Verify ID
          </SubmitButton>
        </Field>
      </form>
    </Form>
  );
}
