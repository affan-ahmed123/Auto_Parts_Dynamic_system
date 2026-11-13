import { Types } from "mongoose";
import { Make, IMake } from "../models/Make";
import { VehicleModel, IModel } from "../models/Model";
import { AppError } from "../utils/apiResponse";
import { slugify } from "../utils/slugify";
import { CreateMakeInput, CreateModelInput } from "../validators/vehicle.schema";

export const getAllMakes = async (includeInactive = false): Promise<IMake[]> => {
  const filter = includeInactive ? {} : { isActive: true };
  return Make.find(filter).sort({ name: 1 });
};

export const resolveMakeId = async (makeIdentifier: string): Promise<Types.ObjectId | null> => {
  if (Types.ObjectId.isValid(makeIdentifier)) {
    return new Types.ObjectId(makeIdentifier);
  }
  const found = await Make.findOne({ slug: makeIdentifier.toLowerCase() });
  return found ? found._id : null;
};

export const resolveModelId = async (
  modelIdentifier: string,
  makeId?: Types.ObjectId | null
): Promise<Types.ObjectId | null> => {
  if (Types.ObjectId.isValid(modelIdentifier)) {
    return new Types.ObjectId(modelIdentifier);
  }
  const query: Record<string, unknown> = { slug: modelIdentifier.toLowerCase() };
  if (makeId) query.make = makeId;
  const found = await VehicleModel.findOne(query);
  return found ? found._id : null;
};

export const getModelsByMake = async (makeIdentifier: string): Promise<IModel[]> => {
  const makeId = await resolveMakeId(makeIdentifier);
  if (!makeId) {
    return [];
  }
  return VehicleModel.find({ make: makeId, isActive: true })
    .populate("make", "name slug")
    .sort({ name: 1 });
};

export const getAllModels = async (): Promise<IModel[]> => {
  return VehicleModel.find().populate("make", "name slug").sort({ name: 1 });
};

export const getYearsForVehicle = async (
  makeIdentifier: string,
  modelIdentifier: string
): Promise<number[]> => {
  const makeId = await resolveMakeId(makeIdentifier);
  if (!makeId) return [];

  const modelId = await resolveModelId(modelIdentifier, makeId);
  if (!modelId) return [];

  const modelDoc = await VehicleModel.findOne({ _id: modelId, make: makeId });
  if (!modelDoc) return [];

  const years: number[] = [];
  for (let yr = modelDoc.yearTo; yr >= modelDoc.yearFrom; yr--) {
    years.push(yr);
  }
  return years;
};

export const createMake = async (data: CreateMakeInput): Promise<IMake> => {
  const slug = slugify(data.name);
  const existing = await Make.findOne({ $or: [{ name: data.name }, { slug }] });
  if (existing) {
    throw new AppError("A vehicle make with this name already exists.", 409);
  }
  return Make.create({
    name: data.name,
    slug,
    logoUrl: data.logoUrl || "",
  });
};

export const deleteMake = async (id: string): Promise<void> => {
  const make = await Make.findByIdAndDelete(id);
  if (!make) {
    throw new AppError("Vehicle make not found.", 404);
  }
  await VehicleModel.deleteMany({ make: id });
};

export const createModel = async (data: CreateModelInput): Promise<IModel> => {
  if (data.yearTo < data.yearFrom) {
    throw new AppError("Year To must be greater than or equal to Year From.", 400);
  }

  const makeExists = await Make.findById(data.make);
  if (!makeExists) {
    throw new AppError("Selected vehicle make does not exist.", 404);
  }

  const slug = slugify(data.name);
  const existing = await VehicleModel.findOne({ make: data.make, slug });
  if (existing) {
    throw new AppError("This model already exists for the selected make.", 409);
  }

  const created = await VehicleModel.create({
    make: data.make,
    name: data.name,
    slug,
    yearFrom: data.yearFrom,
    yearTo: data.yearTo,
  });

  return created.populate("make", "name slug");
};

export const deleteModel = async (id: string): Promise<void> => {
  const deleted = await VehicleModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError("Vehicle model not found.", 404);
  }
};

