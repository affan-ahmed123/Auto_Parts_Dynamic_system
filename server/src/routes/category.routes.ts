import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema } from "../validators/vehicle.schema";

const router = Router();

router.get("/", categoryController.getCategories);
router.post("/", authenticate, requireAdmin, validate(createCategorySchema), categoryController.createCategory);
router.put("/:id", authenticate, requireAdmin, categoryController.updateCategory);
router.delete("/:id", authenticate, requireAdmin, categoryController.deleteCategory);

export default router;

