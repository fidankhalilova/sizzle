// Add these new interfaces to your Types/types.ts file

// Shipping Address Interface
export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Add these to your existing types
export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  maxQuantity?: number;
  sku?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  orderNumber: string;
  userEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Order Creation Data (what we send to API)
export interface CreateOrderData {
  orderNumber: string;
  userEmail: string;
  status: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

// Order Input Data (what checkout page sends - without orderNumber and status)
export interface OrderInputData {
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

// Existing interfaces (already in your types.ts)
export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  colors: string[];
  sizes: string[];
  gender: string;
}

export interface StrapiProduct {
  id?: number;
  attributes?: any;
  name?: string;
  price?: number;
  image?: any;
  categories?: any;
  sizes?: any;
  colors?: any;
  gender?: any;
  [key: string]: any;
}

export interface StrapiResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  maxQuantity?: number;
  sku?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading?: boolean;
  error?: string | null;
}
