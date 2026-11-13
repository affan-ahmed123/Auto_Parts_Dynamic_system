import { Types } from "mongoose";
import { Cart, ICart } from "../models/Cart";
import { Part } from "../models/Part";
import { AppError } from "../utils/apiResponse";

const populateCart = async (cart: ICart | null) => {
  if (!cart) return { items: [], subtotal: 0 };
  const populated = await cart.populate({
    path: "items.part",
    select: "name slug partNumber brand price discountPrice images stock isActive",
  });

  // Filter out inactive or deleted parts
  const validItems = populated.items.filter((item) => {
    const p = item.part as unknown as { isActive?: boolean } | null;
    return p && p.isActive !== false;
  });

  let subtotal = 0;
  for (const item of validItems) {
    const p = item.part as unknown as { price: number; discountPrice?: number | null };
    const unitPrice = p.discountPrice !== null && p.discountPrice !== undefined ? p.discountPrice : p.price;
    subtotal += unitPrice * item.quantity;
  }

  return {
    items: validItems,
    subtotal,
  };
};

export const getUserCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });
  return populateCart(cart);
};

export const addOrUpdateCartItem = async (
  userId: string,
  partId: string,
  quantity: number
) => {
  const part = await Part.findOne({ _id: partId, isActive: true });
  if (!part) {
    throw new AppError("Part not found or unavailable.", 404);
  }
  if (part.stock < quantity) {
    throw new AppError(`Only ${part.stock} units available in stock.`, 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ part: new Types.ObjectId(partId), quantity }],
    });
  } else {
    const existingIndex = cart.items.findIndex((i) => i.part.toString() === partId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = quantity;
    } else {
      cart.items.push({ part: new Types.ObjectId(partId), quantity });
    }
    await cart.save();
  }

  return populateCart(cart);
};

export const removeCartItem = async (userId: string, partId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return { items: [], subtotal: 0 };
  }

  cart.items = cart.items.filter((i) => i.part.toString() !== partId);
  await cart.save();
  return populateCart(cart);
};

export const syncGuestCart = async (
  userId: string,
  guestItems: Array<{ partId: string; quantity: number }>
) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  for (const guestItem of guestItems) {
    if (!Types.ObjectId.isValid(guestItem.partId)) continue;
    const part = await Part.findOne({ _id: guestItem.partId, isActive: true });
    if (!part || part.stock <= 0) continue;

    const existing = cart.items.find((i) => i.part.toString() === guestItem.partId);
    const desiredQty = Math.min(part.stock, guestItem.quantity);

    if (existing) {
      existing.quantity = Math.min(part.stock, existing.quantity + desiredQty);
    } else {
      cart.items.push({ part: part._id, quantity: desiredQty });
    }
  }

  await cart.save();
  return populateCart(cart);
};

export const clearUserCart = async (userId: string): Promise<void> => {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
};

