// src/Store/Slices/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "../../Types/types";

// Helper functions for localStorage
// RENAMED: Changed from loadCartFromStorage to loadCartFromLocalStorage
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const savedCart = localStorage.getItem("sizzle_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("sizzle_cart", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

// Initial state with data from localStorage
// UPDATED: Use the renamed function
const initialItems = loadCartFromLocalStorage();
const initialTotals = calculateTotals(initialItems);

const initialState: CartState = {
  items: initialItems,
  totalItems: initialTotals.totalItems,
  totalPrice: initialTotals.totalPrice,
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        price: number;
        image: string;
        size: string;
        color: string;
        maxQuantity?: number;
        sku?: string;
      }>
    ) => {
      const { id, size, color, ...itemData } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );

      if (existingItem) {
        // Increase quantity if item already exists
        const newQuantity = existingItem.quantity + 1;
        existingItem.quantity = Math.min(
          newQuantity,
          existingItem.maxQuantity || 99
        );
      } else {
        // Add new item
        state.items.push({
          ...itemData,
          id,
          size,
          color,
          quantity: 1,
          maxQuantity: action.payload.maxQuantity || 99,
        });
      }

      // Update totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage
      saveCartToStorage(state.items);
    },

    // Remove item from cart
    removeFromCart: (
      state,
      action: PayloadAction<{
        id: number;
        size: string;
        color: string;
      }>
    ) => {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      );

      // Update totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      // Save to localStorage
      saveCartToStorage(state.items);
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        size: string;
        color: string;
        quantity: number;
      }>
    ) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity || 99));

        // Update totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;

        // Save to localStorage
        saveCartToStorage(state.items);
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;

      // Clear localStorage
      localStorage.removeItem("sizzle_cart");
    },

    // Sync cart from storage (for multi-tab support)
    syncCartFromStorage: (state) => {
      // UPDATED: Use the renamed function
      const items = loadCartFromLocalStorage();
      state.items = items;
      const totals = calculateTotals(items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },

    // Load cart from storage - KEEP AS ACTION NAME
    loadCartFromStorage: (state) => {
      // UPDATED: Use the renamed function
      const items = loadCartFromLocalStorage();
      state.items = items;
      const totals = calculateTotals(items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCartFromStorage,
  loadCartFromStorage, // This is the Redux action
} = cartSlice.actions;

export default cartSlice.reducer;
