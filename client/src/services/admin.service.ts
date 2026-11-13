import { api } from "./api";
import { ApiResponse } from "../types/api";
import { OrderItem, PartItem, VehicleMake, VehicleModelItem, CategoryItem } from "../types/catalog";
import { User } from "../types/auth";

export interface DashboardData {
  metrics: {
    totalSales: number;
    totalOrders: number;
    pendingOrders: number;
    totalUsers: number;
    totalParts: number;
    lowStockCount: number;
  };
  lowStockParts: PartItem[];
  recentOrders: OrderItem[];
  ordersByStatus: Array<{ status: string; count: number }>;
  dailySales: Array<{ date: string; sales: number; orders: number }>;
}

export interface StockLogEntry {
  _id: string;
  part: { _id: string; name: string; partNumber: string } | null;
  change: number;
  newStock: number;
  reason: string;
  orderId?: { _id: string; orderNumber: string };
  user?: { _id: string; name: string; email: string };
  notes?: string;
  createdAt: string;
}

export const getDashboard = async (): Promise<DashboardData> => {
  const res = await api.get<ApiResponse<DashboardData>>("/admin/dashboard");
  return res.data.data!;
};

export const getStockLogs = async (): Promise<StockLogEntry[]> => {
  const res = await api.get<ApiResponse<StockLogEntry[]>>("/admin/stock-logs");
  return res.data.data || [];
};

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<ApiResponse<User[]>>("/admin/users");
  return res.data.data || [];
};

export const getAllOrders = async (status?: string): Promise<OrderItem[]> => {
  const res = await api.get<ApiResponse<OrderItem[]>>("/admin/orders", {
    params: status ? { status } : undefined,
  });
  return res.data.data || [];
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: OrderItem["orderStatus"]
): Promise<OrderItem> => {
  const res = await api.patch<ApiResponse<OrderItem>>(`/admin/orders/${orderId}/status`, {
    orderStatus,
  });
  return res.data.data!;
};

export const createPart = async (formData: FormData): Promise<PartItem> => {
  const res = await api.post<ApiResponse<PartItem>>("/admin/parts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data!;
};

export const updatePart = async (id: string, formData: FormData): Promise<PartItem> => {
  const res = await api.put<ApiResponse<PartItem>>(`/admin/parts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data!;
};

export const deletePart = async (id: string): Promise<void> => {
  await api.delete(`/admin/parts/${id}`);
};

export const restockPart = async (
  id: string,
  change: number,
  notes?: string
): Promise<PartItem> => {
  const res = await api.post<ApiResponse<PartItem>>(`/admin/parts/${id}/restock`, {
    change,
    reason: change > 0 ? "manual_restock" : "adjustment",
    notes,
  });
  return res.data.data!;
};

export const createCategory = async (name: string, description: string): Promise<CategoryItem> => {
  const res = await api.post<ApiResponse<CategoryItem>>("/categories", { name, description });
  return res.data.data!;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const createMake = async (name: string): Promise<VehicleMake> => {
  const res = await api.post<ApiResponse<VehicleMake>>("/vehicles/makes", { name });
  return res.data.data!;
};

export const deleteMake = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/makes/${id}`);
};

export const createModel = async (
  make: string,
  name: string,
  yearFrom: number,
  yearTo: number
): Promise<VehicleModelItem> => {
  const res = await api.post<ApiResponse<VehicleModelItem>>("/vehicles/models", {
    make,
    name,
    yearFrom,
    yearTo,
  });
  return res.data.data!;
};

export const deleteModel = async (id: string): Promise<void> => {
  await api.delete(`/vehicles/models/${id}`);
};

