import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, AppError } from "../utils/apiResponse";
import * as vehicleService from "../services/vehicle.service";
import { CreateMakeInput, CreateModelInput } from "../validators/vehicle.schema";

export const getMakes = asyncHandler(async (_req: Request, res: Response) => {
  const makes = await vehicleService.getAllMakes();
  return sendSuccess(res, "Vehicle makes retrieved successfully", makes);
});

export const getModels = asyncHandler(async (req: Request, res: Response) => {
  const make = req.query.make as string | undefined;
  if (!make) {
    const allModels = await vehicleService.getAllModels();
    return sendSuccess(res, "All vehicle models retrieved successfully", allModels);
  }
  const models = await vehicleService.getModelsByMake(make);
  return sendSuccess(res, "Vehicle models retrieved successfully", models);
});

export const getYears = asyncHandler(async (req: Request, res: Response) => {
  const make = req.query.make as string | undefined;
  const model = req.query.model as string | undefined;
  if (!make || !model) {
    throw new AppError("Both 'make' and 'model' query parameters are required.", 400);
  }
  const years = await vehicleService.getYearsForVehicle(make, model);
  return sendSuccess(res, "Compatible years retrieved successfully", years);
});

export const createMake = asyncHandler(async (req: Request, res: Response) => {
  const created = await vehicleService.createMake(req.body as CreateMakeInput);
  return sendSuccess(res, "Vehicle make created successfully", created, 201);
});

export const deleteMake = asyncHandler(async (req: Request, res: Response) => {
  await vehicleService.deleteMake(String(req.params.id));
  return sendSuccess(res, "Vehicle make deleted successfully");
});

export const createModel = asyncHandler(async (req: Request, res: Response) => {
  const created = await vehicleService.createModel(req.body as CreateModelInput);
  return sendSuccess(res, "Vehicle model created successfully", created, 201);
});

export const deleteModel = asyncHandler(async (req: Request, res: Response) => {
  await vehicleService.deleteModel(String(req.params.id));
  return sendSuccess(res, "Vehicle model deleted successfully");
});
