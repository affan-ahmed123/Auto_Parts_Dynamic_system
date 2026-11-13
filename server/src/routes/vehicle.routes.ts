import { Router } from "express";
import * as vehicleController from "../controllers/vehicle.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createMakeSchema, createModelSchema } from "../validators/vehicle.schema";

const router = Router();

// Public cascading vehicle endpoints
router.get("/makes", vehicleController.getMakes);
router.get("/models", vehicleController.getModels);
router.get("/years", vehicleController.getYears);

// Admin Make & Model management
router.post("/makes", authenticate, requireAdmin, validate(createMakeSchema), vehicleController.createMake);
router.delete("/makes/:id", authenticate, requireAdmin, vehicleController.deleteMake);
router.post("/models", authenticate, requireAdmin, validate(createModelSchema), vehicleController.createModel);
router.delete("/models/:id", authenticate, requireAdmin, vehicleController.deleteModel);

export default router;

