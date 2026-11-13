import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import * as categoryService from "../services/category.service";
import { CreateCategoryInput } from "../validators/vehicle.schema";

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return sendSuccess(res, "Categories retrieved successfully", categories);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const created = await categoryService.createCategory(req.body as CreateCategoryInput);
  return sendSuccess(res, "Category created successfully", created, 201);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const updated = await categoryService.updateCategory(
    String(req.params.id),
    req.body as Partial<CreateCategoryInput>
  );
  return sendSuccess(res, "Category updated successfully", updated);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(String(req.params.id));
  return sendSuccess(res, "Category deleted successfully");
});
