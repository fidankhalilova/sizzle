// src/hooks/useAddToCart.ts
import { useCallback, useState } from "react";
import { useAppDispatch } from "../Store/hooks";

interface AddToCartOptions {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  maxQuantity?: number;
  sku?: string;
}

export const useAddToCart = () => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<AddToCartOptions | null>(
    null
  );

  const handleAddToCart = useCallback(
    async (options: AddToCartOptions) => {
      setIsAdding(true);
      setLastAddedItem(options);

      try {
        // Simulate API call delay (remove in production)
        await new Promise((resolve) => setTimeout(resolve, 300));

        // dispatch(addToCart(options));

        // Success feedback
        console.log("Added to cart:", options);

        // Reset after showing feedback
        setTimeout(() => {
          setLastAddedItem(null);
        }, 2000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setIsAdding(false);
      }
    },
    [dispatch]
  );

  return {
    handleAddToCart,
    isAdding,
    lastAddedItem,
  };
};
