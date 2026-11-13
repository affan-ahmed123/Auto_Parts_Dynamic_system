import { Schema, model, Document, Types } from "mongoose";

export interface IOrderItem {
  part: Types.ObjectId;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  subtotalAmount: number;
  shippingFee: number;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestEmail: { type: String, lowercase: true, trim: true },
    items: [
      {
        part: { type: Schema.Types.ObjectId, ref: "Part", required: true },
        name: { type: String, required: true },
        partNumber: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, enum: ["COD", "Stripe"], default: "COD" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    subtotalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);

