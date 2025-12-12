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

// Make StrapiProduct interface more flexible
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
  [key: string]: any; // Allow any additional properties
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

// src/types/auth.ts
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

// src/types/cart.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  maxQuantity: number; // For stock limitation
  sku?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}
