import { z } from "zod";

export const createMakeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Make name is required").trim(),
    logoUrl: z.string().optional(),
  }),
});

export const createModelSchema = z.object({
  body: z.object({
    make: z.string().min(1, "Make ID is required"),
    name: z.string().min(1, "Model name is required").trim(),
    yearFrom: z.coerce.number().int().min(1950).max(2035),
    yearTo: z.coerce.number().int().min(1950).max(2035),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Category name is required").trim(),
    description: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export type CreateMakeInput = z.infer<typeof createMakeSchema>["body"];
export type CreateModelInput = z.infer<typeof createModelSchema>["body"];
export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];

