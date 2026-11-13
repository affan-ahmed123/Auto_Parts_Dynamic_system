import { api } from "./api";
import { ApiResponse } from "../types/api";
import { PartItem } from "../types/catalog";

export interface PartsFilterParams {
  make?: string;
  model?: string;
  year?: number | string;
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  inStock?: string;
  page?: number;
  limit?: number;
  sort?: string;
  includeInactive?: string;
}

export interface PartsResponse {
  parts: PartItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  brands: string[];
}

export const getParts = async (params: PartsFilterParams): Promise<PartsResponse> => {
  const cleanParams: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      cleanParams[k] = v;
    }
  }
  const res = await api.get<ApiResponse<PartsResponse>>("/parts", { params: cleanParams });
  return res.data.data!;
};

export const getPartDetail = async (
  idOrSlug: string
): Promise<{ part: PartItem; relatedParts: PartItem[] }> => {
  const res = await api.get<ApiResponse<{ part: PartItem; relatedParts: PartItem[] }>>(
    `/parts/${idOrSlug}`
  );
  return res.data.data!;
};

