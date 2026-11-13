import { Router } from "express";
import * as partController from "../controllers/part.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload.middleware";
import { createPartSchema, updatePartSchema, restockPartSchema } from "../validators/part.schema";

const router = Router();

// Public catalog & details
router.get("/", partController.getParts);
router.get("/:idOrSlug", partController.getPartByIdOrSlug);

// Admin CRUD & restock
router.post(
  "/",
  authenticate,
  requireAdmin,
  upload.array("images", 5),
  validate(createPartSchema),
  partController.createPart
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  upload.array("images", 5),
  validate(updatePartSchema),
  partController.updatePart
);
router.post(
  "/:id/restock",
  authenticate,
  requireAdmin,
  validate(restockPartSchema),
  partController.restockPart
);
router.delete("/:id", authenticate, requireAdmin, partController.deletePart);

export default router;

