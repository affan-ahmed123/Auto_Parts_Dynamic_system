import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as partService from "../services/part.service";
import { uploadImageFile } from "../middlewares/upload.middleware";
import { CreatePartInput, UpdatePartInput, RestockPartInput } from "../validators/part.schema";

export const getParts = asyncHandler(async (req: Request, res: Response) => {
  const result = await partService.getParts(req.query as partService.PartQueryParams);
  return sendSuccess(res, "Parts retrieved successfully", result);
});

export const getPartByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const result = await partService.getPartByIdOrSlug(String(req.params.idOrSlug));
  return sendSuccess(res, "Part details retrieved successfully", result);
});

export const createPart = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const uploadedUrls = await Promise.all(files.map((file) => uploadImageFile(file)));

  const created = await partService.createPart(
    req.body as CreatePartInput,
    uploadedUrls,
    req.user?._id.toString()
  );
  return sendSuccess(res, "Spare part created successfully", created, 201);
});

export const updatePart = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  const uploadedUrls = await Promise.all(files.map((file) => uploadImageFile(file)));

  const updated = await partService.updatePart(
    String(req.params.id),
    req.body as UpdatePartInput,
    uploadedUrls,
    req.user?._id.toString()
  );
  return sendSuccess(res, "Spare part updated successfully", updated);
});

export const restockPart = asyncHandler(async (req: Request, res: Response) => {
  const updated = await partService.restockPart(
    String(req.params.id),
    req.body as RestockPartInput,
    req.user?._id.toString()
  );
  return sendSuccess(res, "Stock adjusted successfully", updated);
});

export const deletePart = asyncHandler(async (req: Request, res: Response) => {
  await partService.deletePart(String(req.params.id));
  return sendSuccess(res, "Spare part deactivated successfully");
});
