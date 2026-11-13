import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as cartService from "../services/cart.service";
import { AddToCartInput, SyncCartInput } from "../validators/order.schema";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getUserCart(req.user!._id.toString());
  return sendSuccess(res, "Cart retrieved successfully", cart);
});

export const addOrUpdateItem = asyncHandler(async (req: Request, res: Response) => {
  const { partId, quantity } = req.body as AddToCartInput;
  const cart = await cartService.addOrUpdateCartItem(
    req.user!._id.toString(),
    partId,
    quantity
  );
  return sendSuccess(res, "Cart updated successfully", cart);
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const partId = String(req.params.partId);
  const cart = await cartService.removeCartItem(
    req.user!._id.toString(),
    partId
  );
  return sendSuccess(res, "Item removed from cart", cart);
});

export const syncCart = asyncHandler(async (req: Request, res: Response) => {
  const { items } = req.body as SyncCartInput;
  const cart = await cartService.syncGuestCart(req.user!._id.toString(), items);
  return sendSuccess(res, "Cart synced successfully", cart);
});
