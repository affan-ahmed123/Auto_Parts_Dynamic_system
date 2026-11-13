import { api } from "./api";
import { ApiResponse } from "../types/api";
import {
  AuthResponseData,
  RegisterResponseData,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  User,
} from "../types/auth";

export const register = async (
  credentials: RegisterCredentials
): Promise<RegisterResponseData> => {
  const response = await api.post<ApiResponse<RegisterResponseData>>(
    "/auth/register",
    credentials
  );
  return response.data.data!;
};

export const verifyEmail = async (
  email: string,
  code: string
): Promise<{ verified: boolean; email: string }> => {
  const response = await api.post<ApiResponse<{ verified: boolean; email: string }>>(
    "/auth/verify-email",
    { email, code }
  );
  return response.data.data!;
};

export const resendCode = async (
  email: string
): Promise<{ email: string; emailDelivered: boolean; devCode?: string }> => {
  const response = await api.post<
    ApiResponse<{ email: string; emailDelivered: boolean; devCode?: string }>
  >("/auth/resend-code", { email });
  return response.data.data!;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponseData> => {
  const response = await api.post<ApiResponse<AuthResponseData>>("/auth/login", credentials);
  return response.data.data!;
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>("/auth/profile");
  return response.data.data!;
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  const response = await api.put<ApiResponse<User>>("/auth/profile", data);
  return response.data.data!;
};
