import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import rootRouter from "./routes";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Security HTTP headers (allow cross-origin images for local uploads)
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        config.clientUrl,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
      ];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode
    },
    credentials: true,
  })
);

// Rate Limiting (100 req per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lightweight NoSQL Injection Protection: strip keys starting with '$'
const sanitizeObject = (obj: unknown): void => {
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      if (key.startsWith("$")) {
        delete (obj as Record<string, unknown>)[key];
      } else {
        sanitizeObject((obj as Record<string, unknown>)[key]);
      }
    }
  }
};

app.use((req: Request, _res: Response, next: NextFunction) => {
  sanitizeObject(req.body);
  sanitizeObject(req.params);
  sanitizeObject(req.query);
  next();
});

// Root welcome check
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Automobile Spare Parts API is running",
    documentation: "/api/health",
  });
});

// Static uploads folder fallback
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// API Routes
app.use("/api", rootRouter);

// 404 Route Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;

