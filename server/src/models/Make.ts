import { Schema, model, Document } from "mongoose";

export interface IMake extends Document {
  name: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const makeSchema = new Schema<IMake>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logoUrl: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Make = model<IMake>("Make", makeSchema);

