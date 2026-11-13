import { z } from "zod";

const compatibilityItemSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  yearFrom: z.coerce.number().int().min(1950).max(2035),
  yearTo: z.coerce.number().int().min(1950).max(2035),
});

const parseJsonArray = <T>(val: unknown): T[] => {
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string") {
    if (!val.trim()) return [];
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseBoolean = (val: unknown): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val === "true" || val === "1";
  return false;
};

export const createPartSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Part name is required").trim(),
    partNumber: z.string().min(2, "Part number (OEM/SKU) is required").trim(),
    brand: z.string().min(1, "Brand is required").trim(),
    category: z.string().min(1, "Category ID is required"),
    description: z.string().min(5, "Description is required"),
    price: z.coerce.number().min(0, "Price must be 0 or higher"),
    discountPrice: z.preprocess(
      (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
      z.number().min(0).nullable().optional()
    ),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
    lowStockThreshold: z.coerce.number().int().min(0).default(5),
    condition: z.enum(["new", "used", "refurbished"]).default("new"),
    warrantyMonths: z.coerce.number().int().min(0).default(12),
    isUniversal: z.preprocess(parseBoolean, z.boolean().default(false)),
    compatibility: z.preprocess(
      (v) => parseJsonArray(v),
      z.array(compatibilityItemSchema).default([])
    ),
    existingImages: z.preprocess(
      (v) => parseJsonArray<string>(v),
      z.array(z.string()).optional()
    ),
    relatedParts: z.preprocess(
      (v) => parseJsonArray<string>(v),
      z.array(z.string()).optional()
    ),
    isActive: z.preprocess(
      (v) => (v === undefined ? true : parseBoolean(v)),
      z.boolean().default(true)
    ),
  }),
});

export const updatePartSchema = z.object({
  body: createPartSchema.shape.body.partial(),
});

export const restockPartSchema = z.object({
  body: z.object({
    change: z.coerce.number().int().refine((n) => n !== 0, "Stock change cannot be zero"),
    reason: z.enum(["manual_restock", "adjustment"]).default("manual_restock"),
    notes: z.string().optional(),
  }),
});

export type CreatePartInput = z.infer<typeof createPartSchema>["body"];
export type UpdatePartInput = z.infer<typeof updatePartSchema>["body"];
export type RestockPartInput = z.infer<typeof restockPartSchema>["body"];

