import axios, { AxiosError } from "axios";
import { ApiResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach JWT token to outgoing requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format API errors consistently
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// Health check service
export const checkHealth = async (): Promise<ApiResponse> => {
  const response = await api.get<ApiResponse>("/health");
  return response.data;
};

