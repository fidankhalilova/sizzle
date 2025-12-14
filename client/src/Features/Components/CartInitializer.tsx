// Create this new file: src/Components/CartInitializer.tsx
// This component loads cart from localStorage into Redux on app start

import { useEffect } from "react";
import { useAppDispatch } from "../../Store/hooks";
import { addToCart, clearCart } from "../../Store/Slices/cartSlice";
import type { CartItem } from "../../Store/Slices/cartSlice";

const CartInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🔄 CartInitializer: Starting cart load...");

    try {
      const savedCart = localStorage.getItem("cart");
      console.log("📦 localStorage cart data:", savedCart);

      if (!savedCart) {
        console.log("📦 No cart in localStorage");
        return;
      }

      const parsedCart = JSON.parse(savedCart);
      console.log("📦 Parsed cart:", parsedCart);

      if (!parsedCart.items || parsedCart.items.length === 0) {
        console.log("📦 Empty cart in localStorage");
        return;
      }

      console.log(`🔄 Loading ${parsedCart.items.length} items into Redux...`);

      // Clear Redux cart first
      dispatch(clearCart());

      // Add each item to Redux
      parsedCart.items.forEach((item: CartItem) => {
        console.log("➕ Adding item:", item);
        dispatch(addToCart(item));
      });

      console.log("✅ Cart loaded successfully!");
    } catch (error) {
      console.error("❌ Failed to load cart from localStorage:", error);
      localStorage.removeItem("cart");
    }
  }, [dispatch]);

  return null;
};

export default CartInitializer;
