import { z } from "zod";

export const accountProfileSchema = z.object({
  business_name: z.string().trim().min(2, "Enter your business name"),
  contact_number: z
    .string()
    .trim()
    .regex(/^(\+?\d{7,15})?$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  // Rendered disabled in the UI — kept in the form so the field still shows
  // its current value, but it is never sent on save.
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

/** Shape sent to PATCH /vendors/me — only changed, editable fields */
export type UpdateVendorProfilePayload = Partial<
  Omit<AccountProfileInput, "business_address">
> & {
  pickup_enabled?: boolean;
};
