import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as adminService from "../services/admin.service";

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  return sendSuccess(res, "Dashboard data retrieved successfully", stats);
});

export const getStockLogs = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt((req.query.limit as string) || "50", 10);
  const logs = await adminService.getStockLogs(limit);
  return sendSuccess(res, "Stock logs retrieved successfully", logs);
});

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  return sendSuccess(res, "Users retrieved successfully", users);
});

