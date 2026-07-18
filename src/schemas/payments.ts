import { z } from "zod";

export const bankAccountSchema = z.object({
  bank_code: z.string().min(1, "Select your bank"),
  account_number: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Enter your 10-digit account number"),
});

export type BankAccountInput = z.infer<typeof bankAccountSchema>;

/** Shape sent to POST /payments/bank-account. bank_name is derived from the
 *  picked bank; account_name is never sent — Paystack resolves it. */
export interface BankAccountPayload extends BankAccountInput {
  bank_name: string;
}
