import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import * as orderController from "../controllers/order.controller";
import * as partController from "../controllers/part.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";
import { createPartSchema, updatePartSchema, restockPartSchema } from "../validators/part.schema";
import { updateOrderStatusSchema } from "../validators/order.schema";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/dashboard", adminController.getDashboard);
router.get("/stock-logs", adminController.getStockLogs);
router.get("/users", adminController.getUsers);

// Admin convenience aliases matching API design table
router.get("/orders", orderController.getAllOrders);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), orderController.updateOrderStatus);

router.post("/parts", upload.array("images", 5), validate(createPartSchema), partController.createPart);
router.put("/parts/:id", upload.array("images", 5), validate(updatePartSchema), partController.updatePart);
router.post("/parts/:id/restock", validate(restockPartSchema), partController.restockPart);
router.delete("/parts/:id", partController.deletePart);

export default router;

