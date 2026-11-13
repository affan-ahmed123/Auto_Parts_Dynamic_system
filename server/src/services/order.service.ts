import { Types } from "mongoose";
import { Order, IOrder, IOrderItem } from "../models/Order";
import { Part } from "../models/Part";
import { StockLog } from "../models/StockLog";
import { Cart } from "../models/Cart";
import { AppError } from "../utils/apiResponse";
import { CreateOrderInput } from "../validators/order.schema";

const generateOrderNumber = (): string => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${datePart}-${randomPart}`;
};

export const createOrder = async (
  input: CreateOrderInput,
  userId?: string
): Promise<IOrder> => {
  const decrementedItems: Array<{ partId: Types.ObjectId; quantity: number; newStock: number }> = [];
  const orderItems: IOrderItem[] = [];
  let subtotalAmount = 0;

  try {
    for (const item of input.items) {
      if (!Types.ObjectId.isValid(item.partId)) {
        throw new AppError(`Invalid part ID: ${item.partId}`, 400);
      }

      // Atomic stock decrement with overselling prevention
      const updatedPart = await Part.findOneAndUpdate(
        {
          _id: item.partId,
          isActive: true,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true }
      );

      if (!updatedPart) {
        const existingPart = await Part.findById(item.partId);
        if (!existingPart || !existingPart.isActive) {
          throw new AppError("One of the selected parts is no longer available.", 404);
        }
        throw new AppError(
          `Insufficient stock for "${existingPart.name}". Available: ${existingPart.stock}, Requested: ${item.quantity}.`,
          400
        );
      }

      decrementedItems.push({
        partId: updatedPart._id,
        quantity: item.quantity,
        newStock: updatedPart.stock,
      });

      // Server-side price calculation (never trust client prices)
      const unitPrice =
        updatedPart.discountPrice !== null && updatedPart.discountPrice !== undefined
          ? updatedPart.discountPrice
          : updatedPart.price;
      const itemSubtotal = Number((unitPrice * item.quantity).toFixed(2));
      subtotalAmount += itemSubtotal;

      orderItems.push({
        part: updatedPart._id,
        name: updatedPart.name,
        partNumber: updatedPart.partNumber,
        price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    subtotalAmount = Number(subtotalAmount.toFixed(2));
    const shippingFee = subtotalAmount >= 150 ? 0 : 10;
    const totalAmount = Number((subtotalAmount + shippingFee).toFixed(2));

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: userId ? new Types.ObjectId(userId) : undefined,
      guestEmail: input.guestEmail || undefined,
      items: orderItems,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      subtotalAmount,
      shippingFee,
      totalAmount,
      notes: input.notes || "",
    });

    // Record StockLogs
    await StockLog.insertMany(
      decrementedItems.map((dec) => ({
        part: dec.partId,
        change: -dec.quantity,
        newStock: dec.newStock,
        reason: "order",
        orderId: order._id,
        user: userId ? new Types.ObjectId(userId) : undefined,
        notes: `Order ${order.orderNumber} placed`,
      }))
    );

    // Clear user cart if logged in
    if (userId) {
      await Cart.findOneAndUpdate({ user: userId }, { items: [] });
    }

    return order;
  } catch (error) {
    // Rollback atomic stock decrements if any item failed mid-way
    for (const rollback of decrementedItems) {
      await Part.findByIdAndUpdate(rollback.partId, {
        $inc: { stock: rollback.quantity },
      });
    }
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (
  orderId: string,
  userId: string,
  isAdmin: boolean
): Promise<IOrder> => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new AppError("Invalid order ID.", 400);
  }
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (!isAdmin && (!order.user || order.user._id.toString() !== userId)) {
    throw new AppError("Forbidden: You do not have permission to view this order.", 403);
  }

  return order;
};

export const cancelOrder = async (
  orderId: string,
  userId: string,
  isAdmin: boolean
): Promise<IOrder> => {
  const order = await getOrderById(orderId, userId, isAdmin);

  if (order.orderStatus === "cancelled") {
    throw new AppError("This order is already cancelled.", 400);
  }

  if (!isAdmin && order.orderStatus !== "pending") {
    throw new AppError(
      `Only pending orders can be cancelled by customers. Current status: ${order.orderStatus}.`,
      400
    );
  }

  // Restore stock atomically and log stock movement
  for (const item of order.items) {
    const updatedPart = await Part.findByIdAndUpdate(
      item.part,
      { $inc: { stock: item.quantity } },
      { new: true }
    );
    if (updatedPart) {
      await StockLog.create({
        part: item.part,
        change: item.quantity,
        newStock: updatedPart.stock,
        reason: "cancel",
        orderId: order._id,
        user: new Types.ObjectId(userId),
        notes: `Order ${order.orderNumber} cancelled`,
      });
    }
  }

  order.orderStatus = "cancelled";
  await order.save();
  return order;
};

export const getAllOrders = async (status?: string): Promise<IOrder[]> => {
  const filter: Record<string, unknown> = {};
  if (status && ["pending", "confirmed", "shipped", "delivered", "cancelled"].includes(status)) {
    filter.orderStatus = status;
  }
  return Order.find(filter).populate("user", "name email").sort({ createdAt: -1 });
};

export const updateOrderStatus = async (
  orderId: string,
  nextStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  adminUserId: string
): Promise<IOrder> => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError("Order not found.", 404);
  }

  if (order.orderStatus === "cancelled") {
    throw new AppError("Cancelled orders cannot change status.", 400);
  }

  if (nextStatus === "cancelled") {
    return cancelOrder(orderId, adminUserId, true);
  }

  order.orderStatus = nextStatus;
  if (nextStatus === "delivered") {
    order.paymentStatus = "paid";
  }
  await order.save();
  return order.populate("user", "name email");
};

