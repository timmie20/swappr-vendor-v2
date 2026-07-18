"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FieldGroup } from "@/components/ui/field";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { SubmitButton } from "@/components/forms/submit-button";
import { bankAccountSchema, BankAccountInput } from "@/schemas/payments";
import { useBanks, useSaveBankAccount } from "@/hooks/services/use-payments";
import { notify } from "@/helpers/notify";
import type { VendorProfile } from "@/types/auth";

type BankAccountDialogProps = {
  profile: VendorProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BankAccountDialog({
  profile,
  open,
  onOpenChange,
}: BankAccountDialogProps) {
  // Only fetch the bank list once the vendor actually opens the form
  const { data: banks, isLoading: banksLoading } = useBanks({ enabled: open });

  const form = useForm<BankAccountInput>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank_code: profile.bank_code ?? "",
      account_number: profile.account_number ?? "",
    },
  });

  // Re-prefill from the saved account each time the dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        bank_code: profile.bank_code ?? "",
        account_number: profile.account_number ?? "",
      });
    }
  }, [open, profile, form]);

  const bankOptions = useMemo(() => {
    // The option value is the bank code (what the payload needs) — dedupe on
    // it, since Paystack's list can repeat a code across bank records
    const seen = new Set<string>();
    return (banks ?? [])
      .filter((b) => !seen.has(b.code) && (seen.add(b.code), true))
      .map((b) => ({ value: b.code, label: b.name }));
  }, [banks]);

  const { mutate: saveBankAccount, isPending } = useSaveBankAccount();

  const onSubmit = (values: BankAccountInput) => {
    const bank = banks?.find((b) => b.code === values.bank_code);
    if (!bank) {
      notify.error("Select your bank");
      return;
    }

    saveBankAccount(
      { ...values, bank_name: bank.name },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const hasAccount = !!profile.account_name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hasAccount ? "Change payout account" : "Add payout account"}
          </DialogTitle>
          <DialogDescription>
            {hasAccount
              ? "Saving new details replaces your current payout account — future payouts go to the new one."
              : "Where your Swappr earnings are paid out."}{" "}
            We confirm the account with Paystack before saving, so the account
            name is verified automatically.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormSelect
                control={form.control}
                name="bank_code"
                label="Bank"
                options={bankOptions}
                placeholder={banksLoading ? "Loading banks..." : "Select your bank"}
                disabled={banksLoading}
                required
              />
              <FormInput
                control={form.control}
                name="account_number"
                label="Account number"
                placeholder="10-digit NUBAN account number"
                required
              />
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <SubmitButton
                type="submit"
                isLoading={isPending}
                loadingText="Verifying with Paystack..."
                className="w-auto px-6"
              >
                Save account
              </SubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
