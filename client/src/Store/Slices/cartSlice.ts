// src/Store/Slices/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  userId: string | null;
}

// Load cart from localStorage with user filtering
const loadCartFromStorage = (
  currentUserId: string | null = null
): CartState => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      console.log("📦 No cart in localStorage");
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        userId: currentUserId,
      };
    }

    const parsedCart = JSON.parse(serializedCart);
    console.log("📦 Loading cart from localStorage:", parsedCart);

    // If we have a current user, only load cart if it belongs to them
    if (currentUserId && parsedCart.userId !== currentUserId) {
      console.log("📦 Cart belongs to different user, starting fresh");
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        userId: currentUserId,
      };
    }

    // Extract items and recalculate totals to ensure accuracy
    const items = parsedCart.items || [];
    const totals = calculateTotals(items);

    const loadedState = {
      items: items,
      totalItems: totals.totalItems,
      totalPrice: totals.totalPrice,
      userId: parsedCart.userId || currentUserId,
    };

    console.log("✅ Cart loaded:", loadedState);
    return loadedState;
  } catch (err) {
    console.error("❌ Could not load cart from localStorage", err);
    localStorage.removeItem("cart"); // Clear corrupted data
    localStorage.removeItem("pendingCartItems"); // Clear pending items too
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      userId: currentUserId,
    };
  }
};

// Save cart to localStorage with user ID
const saveCartToStorage = (state: CartState) => {
  try {
    const serializedCart = JSON.stringify(state);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    console.error("Could not save cart to localStorage", err);
  }
};

// Save pending items (for non-authenticated users)
const savePendingItems = (items: CartItem[]) => {
  try {
    const serializedItems = JSON.stringify(items);
    localStorage.setItem("pendingCartItems", serializedItems);
  } catch (err) {
    console.error("Could not save pending items to localStorage", err);
  }
};

// Load pending items
const loadPendingItems = (): CartItem[] => {
  try {
    const serializedItems = localStorage.getItem("pendingCartItems");
    return serializedItems ? JSON.parse(serializedItems) : [];
  } catch (err) {
    console.error("Could not load pending items from localStorage", err);
    return [];
  }
};

// Calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

// Initial state - loads cart based on current auth state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  userId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Initialize cart with user data
    initializeCart: (
      state,
      action: PayloadAction<{ userId: string | null }>
    ) => {
      const { userId } = action.payload;
      const loadedState = loadCartFromStorage(userId);
      state.items = loadedState.items;
      state.totalItems = loadedState.totalItems;
      state.totalPrice = loadedState.totalPrice;
      state.userId = userId;
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, size, color } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      saveCartToStorage(state);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; size: string; color: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          )
      );

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      saveCartToStorage(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        size: string;
        color: string;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;

      saveCartToStorage(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;

      saveCartToStorage(state);
    },

    // Set user ID and merge pending items
    setUserCart: (state, action: PayloadAction<{ userId: string }>) => {
      const { userId } = action.payload;

      // Load pending items
      const pendingItems = loadPendingItems();

      // Merge pending items with current cart
      pendingItems.forEach((pendingItem) => {
        const existingItem = state.items.find(
          (item) =>
            item.id === pendingItem.id &&
            item.size === pendingItem.size &&
            item.color === pendingItem.color
        );

        if (existingItem) {
          existingItem.quantity += pendingItem.quantity;
        } else {
          state.items.push(pendingItem);
        }
      });

      // Update totals
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.userId = userId;

      // Save merged cart
      saveCartToStorage(state);

      // Clear pending items
      localStorage.removeItem("pendingCartItems");
    },

    // Clear cart when user logs out
    clearUserCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.userId = null;

      // Don't clear localStorage here - keep it for pending items
      // localStorage.removeItem("cart");
    },

    // Save item to pending (for non-authenticated users)
    addToPending: (_state, action: PayloadAction<CartItem>) => {
      const pendingItems = loadPendingItems();
      const newItem = action.payload;

      const existingItem = pendingItems.find(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        pendingItems.push(newItem);
      }

      savePendingItems(pendingItems);
    },
  },
});

export const {
  initializeCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setUserCart,
  clearUserCart,
  addToPending,
} = cartSlice.actions;
export default cartSlice.reducer;
