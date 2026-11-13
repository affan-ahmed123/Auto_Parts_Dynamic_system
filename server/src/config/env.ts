import path from "path";
import dotenv from "dotenv";

// Resolve .env from server directory or current working directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/automobile_parts",
  jwtSecret: process.env.JWT_SECRET || "fallback_secret_change_in_production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER || "affan.codes01@gmail.com",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "AutoParts Store <affan.codes01@gmail.com>",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "affannadeem08@gmail.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
};
