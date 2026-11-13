import { Schema, model, Document, Types } from "mongoose";

export interface IStockLog extends Document {
  part: Types.ObjectId;
  change: number;
  newStock: number;
  reason: "order" | "cancel" | "manual_restock" | "adjustment";
  orderId?: Types.ObjectId;
  user?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

export const stockLogSchema = new Schema<IStockLog>(
  {
    part: { type: Schema.Types.ObjectId, ref: "Part", required: true, index: true },
    change: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: {
      type: String,
      enum: ["order", "cancel", "manual_restock", "adjustment"],
      required: true,
    },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const StockLog = model<IStockLog>("StockLog", stockLogSchema);

