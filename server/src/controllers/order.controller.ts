import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as orderService from "../services/order.service";
import { CreateOrderInput, UpdateOrderStatusInput } from "../validators/order.schema";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(
    req.body as CreateOrderInput,
    req.user?._id.toString()
  );
  return sendSuccess(res, "Order placed successfully", order, 201);
});

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.getUserOrders(req.user!._id.toString());
  return sendSuccess(res, "Order history retrieved successfully", orders);
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(
    String(req.params.id),
    req.user!._id.toString(),
    req.user!.role === "admin"
  );
  return sendSuccess(res, "Order details retrieved successfully", order);
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.cancelOrder(
    String(req.params.id),
    req.user!._id.toString(),
    req.user!.role === "admin"
  );
  return sendSuccess(res, "Order cancelled and stock restored", order);
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const orders = await orderService.getAllOrders(status);
  return sendSuccess(res, "All orders retrieved successfully", orders);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderStatus } = req.body as UpdateOrderStatusInput;
  const updated = await orderService.updateOrderStatus(
    String(req.params.id),
    orderStatus,
    req.user!._id.toString()
  );
  return sendSuccess(res, "Order status updated successfully", updated);
});
