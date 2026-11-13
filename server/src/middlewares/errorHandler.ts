import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/apiResponse";
import { config } from "../config/env";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  // AppError (Known operational error)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: formattedErrors,
    });
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (typeof err === "object" && err !== null && "name" in err && (err as { name: string }).name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier format",
    });
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: number }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const fieldName = keyValue ? Object.keys(keyValue)[0] : "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${fieldName} already exists`,
    });
  }

  // Generic / Unexpected Error
  console.error("[Unhandled Error]:", err);
  const message =
    err instanceof Error ? err.message : "Internal Server Error";

  return res.status(500).json({
    success: false,
    message: config.nodeEnv === "production" ? "Internal Server Error" : message,
    ...(config.nodeEnv !== "production" && err instanceof Error ? { stack: err.stack } : {}),
  });
};

