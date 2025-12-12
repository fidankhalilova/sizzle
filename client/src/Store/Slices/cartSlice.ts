// src/Store/Slices/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Cart Item Interface
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  maxQuantity?: number;
}

// Cart State Interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // NEW: Track if cart is loaded from storage
}

// ========== LOCAL STORAGE HELPERS ==========
const CART_STORAGE_KEY = "sizzle_cart";

// Helper function to load cart from localStorage with better validation
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") {
    console.log("⚠️  Window is undefined, skipping localStorage load");
    return [];
  }

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) {
      console.log("📭 No cart data found in localStorage");
      return [];
    }

    const parsedData = JSON.parse(cartData);

    // Validate that we have an array
    if (!Array.isArray(parsedData)) {
      console.error("❌ Cart data is not an array:", typeof parsedData);
      localStorage.removeItem(CART_STORAGE_KEY); // Clean up invalid data
      return [];
    }

    // Validate each item structure
    const validatedItems: CartItem[] = [];
    for (const item of parsedData) {
      if (
        item &&
        typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        typeof item.size === "string" &&
        typeof item.color === "string" &&
        item.image
      ) {
        validatedItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: Math.max(1, item.quantity),
          size: item.size,
          color: item.color,
          maxQuantity: item.maxQuantity || 99,
        });
      } else {
        console.warn("⚠️  Skipping invalid cart item:", item);
      }
    }

    console.log(
      `✅ Loaded ${validatedItems.length} valid items from localStorage`
    );
    return validatedItems;
  } catch (error) {
    console.error("❌ Error loading cart from localStorage:", error);
    // Try to clean up corrupted data
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      // Ignore cleanup errors
    }
    return [];
  }
};

// Helper function to save cart to localStorage with timestamp
const saveCartToStorage = (items: CartItem[]): void => {
  if (typeof window === "undefined") {
    console.log("⚠️  Window is undefined, skipping localStorage save");
    return;
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    console.log(
      `💾 Cart saved: ${
        items.length
      } items at ${new Date().toLocaleTimeString()}`
    );

    // Verify the save worked
    const verify = localStorage.getItem(CART_STORAGE_KEY);
    if (!verify) {
      console.error("❌ Cart save verification failed!");
    }
  } catch (error) {
    console.error("❌ Error saving cart to localStorage:", error);

    // Try to save with simplified data if full save fails
    try {
      const simplifiedItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(simplifiedItems));
      console.log("🔄 Saved simplified cart data");
    } catch (e) {
      console.error("❌ Even simplified save failed:", e);
    }
  }
};

// Calculate totals
const calculateTotals = (
  items: CartItem[]
): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

// ========== INITIAL STATE ==========
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  isInitialized: false, // Start as false
};

// ========== CART SLICE ==========
const cartSlice = createSlice({
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
      }>
    ) => {
      try {
        console.log("➕ ADD_TO_CART action:", action.payload);

        const { id, size, color, ...itemData } = action.payload;

        // Find existing item with same id, size, and color
        const existingItemIndex = state.items.findIndex(
          (item) => item.id === id && item.size === size && item.color === color
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          const existingItem = state.items[existingItemIndex];
          const newQuantity = existingItem.quantity + 1;
          const maxQty = existingItem.maxQuantity || 99;

          state.items[existingItemIndex].quantity = Math.min(
            newQuantity,
            maxQty
          );

          console.log(
            `📈 Updated quantity to ${state.items[existingItemIndex].quantity}`
          );
        } else {
          // Add new item
          const newItem: CartItem = {
            ...itemData,
            id,
            size,
            color,
            quantity: 1,
            maxQuantity: action.payload.maxQuantity || 99,
          };
          state.items.push(newItem);
          console.log(`🆕 Added new item: ${newItem.name}`);
        }

        // Update totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;

        console.log(
          `📊 New totals: ${
            state.totalItems
          } items, $${state.totalPrice.toFixed(2)}`
        );

        // Save to localStorage
        console.log("💾 Saving to localStorage...");
        saveCartToStorage(state.items);

        // Double-check the save
        setTimeout(() => {
          const saved = localStorage.getItem(CART_STORAGE_KEY);
          console.log("🔍 Save verification:", saved ? "Success" : "Failed");
        }, 100);
      } catch (error) {
        console.error("❌ Error in addToCart:", error);
        state.error = "Failed to add item to cart";
      }
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
      try {
        const { id, size, color } = action.payload;
        console.log(`🗑️ Removing item: ${id} (${size}, ${color})`);

        const beforeCount = state.items.length;
        state.items = state.items.filter(
          (item) =>
            !(item.id === id && item.size === size && item.color === color)
        );
        const afterCount = state.items.length;

        if (beforeCount === afterCount) {
          console.warn("⚠️  Item not found for removal");
        }

        // Update totals
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;

        // Save to localStorage
        saveCartToStorage(state.items);
      } catch (error) {
        console.error("❌ Error removing from cart:", error);
        state.error = "Failed to remove item from cart";
      }
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
      try {
        const { id, size, color, quantity } = action.payload;

        const itemIndex = state.items.findIndex(
          (item) => item.id === id && item.size === size && item.color === color
        );

        if (itemIndex !== -1) {
          const item = state.items[itemIndex];
          const maxQty = item.maxQuantity || 99;

          // Ensure quantity is between 1 and maxQuantity
          const newQuantity = Math.max(1, Math.min(quantity, maxQty));

          if (item.quantity !== newQuantity) {
            state.items[itemIndex].quantity = newQuantity;
            console.log(`📊 Updated ${item.name} quantity to ${newQuantity}`);

            // Update totals
            const totals = calculateTotals(state.items);
            state.totalItems = totals.totalItems;
            state.totalPrice = totals.totalPrice;

            // Save to localStorage
            saveCartToStorage(state.items);
          }
        } else {
          console.warn(`⚠️  Item not found for quantity update: ${id}`);
        }
      } catch (error) {
        console.error("❌ Error updating quantity:", error);
        state.error = "Failed to update item quantity";
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      try {
        console.log("🗑️ Clearing entire cart");

        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.error = null;

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem(CART_STORAGE_KEY);
          console.log("✅ Cart cleared from localStorage");

          // Verify clear
          const verify = localStorage.getItem(CART_STORAGE_KEY);
          if (verify) {
            console.error("❌ Failed to clear cart from localStorage");
          }
        }
      } catch (error) {
        console.error("❌ Error clearing cart:", error);
        state.error = "Failed to clear cart";
      }
    },

    // Load cart from localStorage - UPDATED
    loadCartFromStorage: (state) => {
      try {
        console.log("🔄 Loading cart from localStorage...");

        const items = loadCartFromLocalStorage();
        state.items = items;

        const totals = calculateTotals(items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.error = null;
        state.isInitialized = true; // Mark as initialized

        console.log(
          `✅ Cart initialized: ${
            items.length
          } items, $${state.totalPrice.toFixed(2)} total`
        );
      } catch (error) {
        console.error("❌ Error loading cart from storage:", error);
        state.error = "Failed to load cart from storage";
        state.isInitialized = true; // Still mark as initialized even if empty
      }
    },

    // Initialize cart state - NEW: For app startup
    initializeCart: (state) => {
      if (!state.isInitialized) {
        console.log("🚀 Initializing cart state...");
        const items = loadCartFromLocalStorage();
        state.items = items;

        const totals = calculateTotals(items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        state.isInitialized = true;

        console.log(`🎉 Cart initialized with ${items.length} items`);
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Force save cart - NEW: For debugging
    forceSaveCart: (state) => {
      console.log("💾 Force saving cart...");
      saveCartToStorage(state.items);
    },
  },
});

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCartFromStorage,
  initializeCart, // NEW
  clearError,
  forceSaveCart, // NEW
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
