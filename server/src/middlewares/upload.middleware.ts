import path from "path";
import fs from "fs";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/env";
import { AppError } from "../utils/apiResponse";

const isCloudinaryConfigured =
  Boolean(config.cloudinary.cloudName) &&
  config.cloudinary.cloudName !== "demo_cloud" &&
  Boolean(config.cloudinary.apiKey) &&
  config.cloudinary.apiKey !== "demo_key";

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

const uploadsDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files (JPG, PNG, WebP) are allowed.", 400));
    }
  },
});

export const uploadImageFile = async (file: Express.Multer.File): Promise<string> => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "autoparts_store" },
        (error, result) => {
          if (error || !result) {
            return reject(new AppError("Cloudinary image upload failed", 500));
          }
          resolve(result.secure_url);
        }
      );
      stream.end(file.buffer);
    });
  }

  // Fallback to local /uploads storage when Cloudinary keys are demo/unset
  const ext = path.extname(file.originalname) || ".jpg";
  const filename = `part-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filepath, file.buffer);

  // Also write to client/public/uploads for immediate browser render
  try {
    const clientUploadsDir = path.resolve(__dirname, "../../../client/public/uploads");
    if (!fs.existsSync(clientUploadsDir)) {
      fs.mkdirSync(clientUploadsDir, { recursive: true });
    }
    await fs.promises.writeFile(path.join(clientUploadsDir, filename), file.buffer);
  } catch (err) {
    console.warn("[Upload] Could not mirror to client public uploads:", err);
  }

  return `/uploads/${filename}`;
};

