import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[MongoDB] Connection failed (${errMsg}). The server is running; update MONGO_URI in .env when ready.`);
    if (config.nodeEnv === "production") {
      process.exit(1);
    }
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Disconnected from database");
});

mongoose.connection.on("reconnected", () => {
  console.log("[MongoDB] Reconnected to database");
});
