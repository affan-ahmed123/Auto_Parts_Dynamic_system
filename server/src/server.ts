import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async (): Promise<void> => {
  const server = app.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(` Auto Parts Server running in [${config.nodeEnv}] mode`);
    console.log(` URL: http://localhost:${config.port}`);
    console.log(` Health check: http://localhost:${config.port}/api/health`);
    console.log(`===============================================`);
  });

  // Connect to MongoDB asynchronously without blocking HTTP server
  connectDB().catch((err) => {
    console.warn("[MongoDB] Initial connection attempt error:", err);
  });

  // Handle Unhandled Promise Rejections
  process.on("unhandledRejection", (err: Error) => {
    console.error(`[Unhandled Rejection] Error: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle Uncaught Exceptions
  process.on("uncaughtException", (err: Error) => {
    console.error(`[Uncaught Exception] Error: ${err.message}`);
    process.exit(1);
  });

  // Graceful Shutdown
  const shutdown = () => {
    console.log("[Server] Gracefully shutting down...");
    server.close(() => {
      console.log("[Server] Closed remaining connections.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

void startServer();
