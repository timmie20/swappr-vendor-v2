import { api } from "@/lib/api/client";
import type { BankAccountPayload } from "@/schemas/payments";

/** Paystack-supported Nigerian bank, for the picker. The raw Paystack
 *  record has many more fields — only what the UI needs is typed. */
export interface Bank {
  id: number;
  name: string;
  code: string;
  slug: string;
}

interface BanksResponse {
  message: string;
  banks: Bank[];
}

export const paymentEndpoints = {
  async getBanks(): Promise<Bank[]> {
    const { data } = await api.get<BanksResponse>("/payments/banks");
    return data.banks;
  },

  /** Add and edit share this endpoint — it always overwrites the vendor's
   *  bank fields. Paystack resolves the account first, so a wrong
   *  number/bank-code combo 400s before anything is saved. */
  async saveBankAccount(
    payload: BankAccountPayload,
  ): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      "/payments/bank-account",
      payload,
    );
    return data;
  },
};
