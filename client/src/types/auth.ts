export interface UserAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string;
  isVerified: boolean;
  address?: UserAddress;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface RegisterResponseData {
  requiresVerification: boolean;
  email: string;
  emailDelivered: boolean;
  devCode?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: UserAddress;
}
