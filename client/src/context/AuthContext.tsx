import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  User,
  LoginCredentials,
  RegisterCredentials,
  RegisterResponseData,
  UpdateProfileData,
} from "../types/auth";
import * as authService from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<RegisterResponseData>;
  verifyEmail: (email: string, code: string) => Promise<{ verified: boolean; email: string }>;
  resendCode: (email: string) => Promise<{ email: string; emailDelivered: boolean; devCode?: string }>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem("auth_token");
    if (!savedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setToken(savedToken);
    } catch (error) {
      console.warn("Session restore failed or expired:", error);
      localStorage.removeItem("auth_token");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const data = await authService.login(credentials);
    localStorage.setItem("auth_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (credentials: RegisterCredentials): Promise<RegisterResponseData> => {
    return authService.register(credentials);
  };

  const verifyEmail = async (email: string, code: string) => {
    return authService.verifyEmail(email, code);
  };

  const resendCode = async (email: string) => {
    return authService.resendCode(email);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileData): Promise<void> => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        verifyEmail,
        resendCode,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
