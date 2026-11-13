import { api } from "./api";
import { ApiResponse } from "../types/api";
import { VehicleMake, VehicleModelItem, CategoryItem } from "../types/catalog";

export const getMakes = async (): Promise<VehicleMake[]> => {
  const res = await api.get<ApiResponse<VehicleMake[]>>("/vehicles/makes");
  return res.data.data || [];
};

export const getModels = async (makeIdOrSlug?: string): Promise<VehicleModelItem[]> => {
  const res = await api.get<ApiResponse<VehicleModelItem[]>>("/vehicles/models", {
    params: makeIdOrSlug ? { make: makeIdOrSlug } : undefined,
  });
  return res.data.data || [];
};

export const getYears = async (makeId: string, modelId: string): Promise<number[]> => {
  const res = await api.get<ApiResponse<number[]>>("/vehicles/years", {
    params: { make: makeId, model: modelId },
  });
  return res.data.data || [];
};

export const getCategories = async (): Promise<CategoryItem[]> => {
  const res = await api.get<ApiResponse<CategoryItem[]>>("/categories");
  return res.data.data || [];
};

