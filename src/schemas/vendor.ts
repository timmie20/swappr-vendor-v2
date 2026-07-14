import { z } from "zod";

export const accountProfileSchema = z.object({
  // Rendered disabled in the UI — locked to the CAC-registered name; the
  // backend rejects it on update (400). Kept in the form only for display.
  business_name: z.string().trim().optional().or(z.literal("")),
  trading_name: z
    .string()
    .trim()
    .min(2, "Trading name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
  contact_number: z
    .string()
    .trim()
    .regex(/^(\+?\d{7,15})?$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  contact_email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  // Editable, but changing it resets inspection verification & pickup —
  // the form warns before saving an address change.
  business_address: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  landmark: z.string().trim().optional().or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(900, "Keep this under 900 characters")
    .optional()
    .or(z.literal("")),
});

export type AccountProfileInput = z.infer<typeof accountProfileSchema>;

/** Shape sent to PATCH /vendors/:id/update — only changed fields.
 *  business_name is rejected by the backend ("should not exist"). */
export type UpdateVendorProfilePayload = Partial<
  Omit<AccountProfileInput, "business_name">
> & {
  logo_url?: string;
  store_photos?: string[];
};
