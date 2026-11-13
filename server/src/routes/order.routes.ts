import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate, optionalAuthenticate, requireAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/order.schema";

const router = Router();

// Public or Authenticated checkout
router.post("/", optionalAuthenticate, validate(createOrderSchema), orderController.createOrder);

// Customer routes
router.get("/my-orders", authenticate, orderController.getMyOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.post("/:id/cancel", authenticate, orderController.cancelOrder);

// Admin order routes
router.get("/", authenticate, requireAdmin, orderController.getAllOrders);
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;

