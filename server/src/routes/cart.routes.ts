import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addToCartSchema, syncCartSchema } from "../validators/order.schema";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/sync", validate(syncCartSchema), cartController.syncCart);
router.post("/items", validate(addToCartSchema), cartController.addOrUpdateItem);
router.delete("/items/:partId", cartController.removeItem);

export default router;

