import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    partId: z.string().min(1, "Part ID is required"),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  }),
});

export const syncCartSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        partId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      })
    ),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
    items: z
      .array(
        z.object({
          partId: z.string().min(1, "Part ID is required"),
          quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
        })
      )
      .min(1, "Order must contain at least one item"),
    shippingAddress: z.object({
      name: z.string().min(2, "Recipient name is required"),
      phone: z.string().min(6, "Valid phone number is required"),
      street: z.string().min(3, "Street address is required"),
      city: z.string().min(2, "City is required"),
      postalCode: z.string().default("00000"),
      country: z.string().default("Pakistan"),
    }),
    paymentMethod: z.enum(["COD", "Stripe"]).default("COD"),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  }),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>["body"];
export type SyncCartInput = z.infer<typeof syncCartSchema>["body"];
export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>["body"];

