import { Schema, model, Document, Types } from "mongoose";

export interface ICompatibility {
  make: Types.ObjectId;
  model: Types.ObjectId;
  yearFrom: number;
  yearTo: number;
}

export interface IPart extends Document {
  name: string;
  slug: string;
  partNumber: string;
  brand: string;
  category: Types.ObjectId;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  condition: "new" | "used" | "refurbished";
  warrantyMonths: number;
  isUniversal: boolean;
  compatibility: ICompatibility[];
  relatedParts?: Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const compatibilitySchema = new Schema<ICompatibility>(
  {
    make: { type: Schema.Types.ObjectId, ref: "Make", required: true },
    model: { type: Schema.Types.ObjectId, ref: "VehicleModel", required: true },
    yearFrom: { type: Number, required: true },
    yearTo: { type: Number, required: true },
  },
  { _id: false }
);

export const partSchema = new Schema<IPart>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    partNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    brand: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },
    images: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    condition: { type: String, enum: ["new", "used", "refurbished"], default: "new" },
    warrantyMonths: { type: Number, default: 12, min: 0 },
    isUniversal: { type: Boolean, default: false },
    compatibility: [compatibilitySchema],
    relatedParts: [{ type: Schema.Types.ObjectId, ref: "Part" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

partSchema.index({ name: "text", partNumber: "text", brand: "text" });
partSchema.index({
  "compatibility.make": 1,
  "compatibility.model": 1,
  "compatibility.yearFrom": 1,
  "compatibility.yearTo": 1,
});
partSchema.index({ price: 1, stock: 1, isActive: 1 });

export const Part = model<IPart>("Part", partSchema);

