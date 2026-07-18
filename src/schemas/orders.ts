import { z } from "zod";

export const deliveryFulfillmentSchema = z.object({
  rider_name: z.string().trim().min(2, "Enter the rider's name"),
  rider_phone: z.string().trim().min(7, "Enter a valid phone number"),
  delivery_fee: z.coerce
    .number({ invalid_type_error: "Enter the delivery fee" })
    .min(0, "Enter the delivery fee"),
  estimated_arrival: z.enum(["same_day", "within_24h", "2_3_days"], {
    required_error: "Select an estimated arrival window",
  }),
});

export type DeliveryFulfillmentInput = z.infer<typeof deliveryFulfillmentSchema>;

const TIME_24H = /^([01]\d|2[0-3]):[0-5]\d$/; // HH:mm — matches backend DTO

export const pickupFulfillmentSchema = z
  .object({
    pickup_date: z.string().min(1, "Select a pickup date"),
    pickup_time_from: z
      .string()
      .regex(TIME_24H, "Set a start time"),
    pickup_time_to: z.string().regex(TIME_24H, "Set an end time"),
  })
  .superRefine((value, ctx) => {
    // "HH:mm" strings compare correctly lexicographically
    if (
      TIME_24H.test(value.pickup_time_from) &&
      TIME_24H.test(value.pickup_time_to) &&
      value.pickup_time_to <= value.pickup_time_from
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickup_time_to"],
        message: "End time must be after the start time",
      });
    }
  });

export type PickupFulfillmentInput = z.infer<typeof pickupFulfillmentSchema>;
