import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as authService from "../services/auth.service";
import {
  RegisterInput,
  VerifyEmailInput,
  ResendCodeInput,
  LoginInput,
  UpdateProfileInput,
} from "../validators/auth.schema";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body as RegisterInput);
  return sendSuccess(
    res,
    "Verification code sent to your email. Please verify your account before signing in.",
    result,
    201
  );
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyUserEmail(req.body as VerifyEmailInput);
  return sendSuccess(
    res,
    "Email verified successfully. You can now sign in with your credentials.",
    result,
    200
  );
});

export const resendCode = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as ResendCodeInput;
  const result = await authService.resendVerificationCode(email);
  return sendSuccess(res, "A new verification code has been sent to your email.", result, 200);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body as LoginInput);
  return sendSuccess(res, "Login successful", result, 200);
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const profile = await authService.getUserProfile(userId);
  return sendSuccess(res, "User profile retrieved successfully", profile, 200);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const updated = await authService.updateUserProfile(userId, req.body as UpdateProfileInput);
  return sendSuccess(res, "Profile updated successfully", updated, 200);
});
