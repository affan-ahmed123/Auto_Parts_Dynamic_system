import { api } from "./api";
import { ApiResponse } from "../types/api";
import { OrderItem } from "../types/catalog";

export interface CreateOrderPayload {
  guestEmail?: string;
  items: Array<{ partId: string; quantity: number }>;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "COD" | "Stripe";
  notes?: string;
}

export const placeOrder = async (payload: CreateOrderPayload): Promise<OrderItem> => {
  const res = await api.post<ApiResponse<OrderItem>>("/orders", payload);
  return res.data.data!;
};

export const getMyOrders = async (): Promise<OrderItem[]> => {
  const res = await api.get<ApiResponse<OrderItem[]>>("/orders/my-orders");
  return res.data.data || [];
};

export const getOrderById = async (id: string): Promise<OrderItem> => {
  const res = await api.get<ApiResponse<OrderItem>>(`/orders/${id}`);
  return res.data.data!;
};

export const cancelOrder = async (id: string): Promise<OrderItem> => {
  const res = await api.post<ApiResponse<OrderItem>>(`/orders/${id}/cancel`);
  return res.data.data!;
};

