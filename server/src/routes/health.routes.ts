import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { sendSuccess } from "../utils/apiResponse";
import { config } from "../config/env";

const router = Router();

const mongoStatusMap: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

router.get("/health", (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const statusString = mongoStatusMap[dbState] || "unknown";

  const healthData = {
    service: "Automobile Spare Parts API",
    status: "ok",
    environment: config.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: statusString,
      connected: dbState === 1,
    },
  };

  return sendSuccess(res, "Server is healthy", healthData);
});

export default router;

