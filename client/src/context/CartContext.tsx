import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartLineItem, CartProduct } from "../types/catalog";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";
import { ApiResponse } from "../types/api";

interface CartContextType {
  items: CartLineItem[];
  subtotal: number;
  itemCount: number;
  addToCart: (part: CartProduct, quantity?: number) => Promise<void>;
  updateQuantity: (partId: string, quantity: number) => Promise<void>;
  removeFromCart: (partId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const GUEST_CART_KEY = "autoparts_guest_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartLineItem[]>(() => {
    try {
      const saved = localStorage.getItem(GUEST_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const loadServerCart = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<{ items: CartLineItem[]; subtotal: number }>>("/cart");
      if (res.data.data?.items) {
        setItems(res.data.data.items);
      }
    } catch (err) {
      console.warn("Could not fetch user cart:", err);
    }
  }, []);

  const syncGuestCartWithServer = useCallback(async () => {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (!saved) {
      await loadServerCart();
      return;
    }
    try {
      const guestItems: CartLineItem[] = JSON.parse(saved);
      if (guestItems.length > 0) {
        await api.post("/cart/sync", {
          items: guestItems.map((i) => ({ partId: i.part._id, quantity: i.quantity })),
        });
        localStorage.removeItem(GUEST_CART_KEY);
      }
      await loadServerCart();
    } catch (err) {
      console.warn("Cart sync failed:", err);
      await loadServerCart();
    }
  }, [loadServerCart]);

  useEffect(() => {
    if (isAuthenticated) {
      void syncGuestCartWithServer();
    } else {
      try {
        const saved = localStorage.getItem(GUEST_CART_KEY);
        setItems(saved ? JSON.parse(saved) : []);
      } catch {
        setItems([]);
      }
    }
  }, [isAuthenticated, syncGuestCartWithServer]);

  const saveGuestItems = (newItems: CartLineItem[]) => {
    setItems(newItems);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
  };

  const addToCart = async (part: CartProduct, quantity = 1) => {
    if (isAuthenticated) {
      const existing = items.find((i) => i.part._id === part._id);
      const nextQty = (existing?.quantity || 0) + quantity;
      const res = await api.post<ApiResponse<{ items: CartLineItem[]; subtotal: number }>>("/cart/items", {
        partId: part._id,
        quantity: nextQty,
      });
      if (res.data.data?.items) {
        setItems(res.data.data.items);
      }
    } else {
      const copy = [...items];
      const index = copy.findIndex((i) => i.part._id === part._id);
      if (index > -1) {
        copy[index].quantity += quantity;
      } else {
        copy.push({ part, quantity });
      }
      saveGuestItems(copy);
    }
  };

  const updateQuantity = async (partId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(partId);
      return;
    }

    if (isAuthenticated) {
      const res = await api.post<ApiResponse<{ items: CartLineItem[]; subtotal: number }>>("/cart/items", {
        partId,
        quantity,
      });
      if (res.data.data?.items) {
        setItems(res.data.data.items);
      }
    } else {
      const copy = items.map((i) => (i.part._id === partId ? { ...i, quantity } : i));
      saveGuestItems(copy);
    }
  };

  const removeFromCart = async (partId: string) => {
    if (isAuthenticated) {
      const res = await api.delete<ApiResponse<{ items: CartLineItem[]; subtotal: number }>>(`/cart/items/${partId}`);
      if (res.data.data?.items) {
        setItems(res.data.data.items);
      }
    } else {
      const filtered = items.filter((i) => i.part._id !== partId);
      saveGuestItems(filtered);
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(GUEST_CART_KEY);
  };

  const subtotal = items.reduce((acc, curr) => {
    const price =
      curr.part.discountPrice !== null && curr.part.discountPrice !== undefined
        ? curr.part.discountPrice
        : curr.part.price;
    return acc + price * curr.quantity;
  }, 0);

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal: Number(subtotal.toFixed(2)),
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

