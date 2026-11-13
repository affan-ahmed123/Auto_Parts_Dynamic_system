export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }> | unknown;
}

export interface HealthCheckData {
  service: string;
  status: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: {
    status: string;
    connected: boolean;
  };
}

