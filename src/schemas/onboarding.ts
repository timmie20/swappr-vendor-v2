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

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm — matches backend DTO

export interface OperatingHours {
  days: DayOfWeek[];
  open_time: string;
  close_time: string;
}

export const completeProfileSchema = z.object({
  description: z
    .string()
    .trim()
    .max(900, "Keep this under 900 characters")
    .optional()
    .or(z.literal("")),
  landmark: z.string().trim().optional().or(z.literal("")),
  // Optional as a whole, but all-or-nothing: leaving every field untouched
  // is valid (hours simply aren't sent), a partial fill is an error
  operating_hours: z
    .object({
      days: z.array(z.enum(DAYS_OF_WEEK)),
      open_time: z.string(),
      close_time: z.string(),
    })
    .superRefine((value, ctx) => {
      const untouched =
        value.days.length === 0 && !value.open_time && !value.close_time;
      if (untouched) return;

      if (value.days.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["days"],
          message: "Select at least one day",
        });
      }
      if (!TIME_24H.test(value.open_time)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["open_time"],
          message: "Set an opening time",
        });
      }
      if (!TIME_24H.test(value.close_time)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["close_time"],
          message: "Set a closing time",
        });
      }
    }),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

/** Shape actually sent to POST /vendor/onboarding/complete-profile */
export interface CompleteProfilePayload {
  description?: string;
  landmark?: string;
  operating_hours?: OperatingHours;
}
