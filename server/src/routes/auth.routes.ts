import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  registerSchema,
  verifyEmailSchema,
  resendCodeSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/resend-code", validate(resendCodeSchema), authController.resendCode);
router.post("/login", validate(loginSchema), authController.login);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, validate(updateProfileSchema), authController.updateProfile);

export default router;
