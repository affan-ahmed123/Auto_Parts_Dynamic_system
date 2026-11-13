import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { User, IUser } from "../models/User";
import { AppError } from "../utils/apiResponse";

interface JwtPayload {
  id: string;
  role: "customer" | "admin";
  email: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Please provide a valid Bearer token.", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Authentication token is missing.", 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (err: unknown) {
      const isExpired = err instanceof jwt.TokenExpiredError;
      throw new AppError(
        isExpired ? "Token has expired. Please log in again." : "Invalid authentication token.",
        401
      );
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new AppError("User account belonging to this token no longer exists.", 401);
    }

    req.user = user as IUser;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user as IUser;
        }
      }
    }
  } catch {
    // Ignore invalid optional token for guest-capable endpoints
  }
  next();
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Forbidden: Admin privileges are required for this action.", 403));
  }
  next();
};
