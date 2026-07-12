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

export const pickupFulfillmentSchema = z.object({
  pickup_date: z.string().min(1, "Select a pickup date"),
  pickup_time_slot: z.string().trim().min(1, "Enter a pickup time slot"),
});

export type PickupFulfillmentInput = z.infer<typeof pickupFulfillmentSchema>;
