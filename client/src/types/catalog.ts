export interface VehicleMake {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface VehicleModelItem {
  _id: string;
  make: string | VehicleMake;
  name: string;
  slug: string;
  yearFrom: number;
  yearTo: number;
}

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  partCount?: number;
}

export interface CompatibilityItem {
  make: VehicleMake;
  model: VehicleModelItem;
  yearFrom: number;
  yearTo: number;
}

export interface PartItem {
  _id: string;
  name: string;
  slug: string;
  partNumber: string;
  brand: string;
  category: CategoryItem;
  description: string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  stock: number;
  lowStockThreshold: number;
  condition: "new" | "used" | "refurbished";
  warrantyMonths: number;
  isUniversal: boolean;
  compatibility: CompatibilityItem[];
  relatedParts?: Array<PartItem | string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  partNumber: string;
  brand: string;
  category?: CategoryItem | string;
  price: number;
  discountPrice?: number | null;
  images: string[];
  stock: number;
  isActive: boolean;
}

export interface CartLineItem {
  part: CartProduct;
  quantity: number;
}

export interface OrderLineItem {
  part: string;
  name: string;
  partNumber: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderItem {
  _id: string;
  orderNumber: string;
  user?: { _id: string; name: string; email: string };
  guestEmail?: string;
  items: OrderLineItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  subtotalAmount: number;
  shippingFee: number;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

