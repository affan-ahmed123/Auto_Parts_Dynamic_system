import { Schema, model, Document, Types } from "mongoose";

export interface IModel extends Document {
  make: Types.ObjectId;
  name: string;
  slug: string;
  yearFrom: number;
  yearTo: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const modelSchema = new Schema<IModel>(
  {
    make: { type: Schema.Types.ObjectId, ref: "Make", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    yearFrom: { type: Number, required: true },
    yearTo: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

modelSchema.index({ make: 1, slug: 1 }, { unique: true });

export const VehicleModel = model<IModel>("VehicleModel", modelSchema);

