import { z } from "zod";

export const verifyBusinessSchema = z.object({
  company_type: z.enum(["RC", "BN", "IT"], {
    required_error: "Select how your business is registered",
  }),
  rc_number: z.string().trim().min(2, "Enter your CAC registration number"),
});

export type VerifyBusinessInput = z.infer<typeof verifyBusinessSchema>;

const idNumberSchema = z
  .string()
  .trim()
  .regex(/^\d{11}$/, "Enter your 11-digit number");

export const verifyId = z.object({ number: idNumberSchema });
export type VerifyIdInput = z.infer<typeof verifyId>;

export type IdMethod = "bvn" | "nin";

export const completeProfileSchema = z.object({
  description: z
    .string()
    .trim()
    .max(500, "Keep this under 500 characters")
    .optional()
    .or(z.literal("")),
  operating_hours: z.string().trim().optional().or(z.literal("")),
  landmark: z.string().trim().optional().or(z.literal("")),
  business_address: z.string().trim().optional().or(z.literal("")),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
