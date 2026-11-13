import app from "../server/src/app";
import { connectDB } from "../server/src/config/db";

let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("[Vercel Serverless] MongoDB connection error:", err);
    }
  }
  return app(req, res);
}
