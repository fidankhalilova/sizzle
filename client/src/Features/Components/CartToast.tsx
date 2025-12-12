// src/Components/CartToast.tsx
import React, { useEffect, useState } from "react";
import { Check, ShoppingBag, X } from "lucide-react";
import { useAppSelector } from "../../Store/hooks";

const CartToast: React.FC = () => {
  const { totalItems } = useAppSelector((state) => state.cart);
  const [showToast, setShowToast] = useState(false);
  const [lastCount, setLastCount] = useState(totalItems);

  useEffect(() => {
    // Show toast when cart count increases
    if (totalItems > lastCount) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
    setLastCount(totalItems);
  }, [totalItems, lastCount]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Added to Cart!</p>
            <p className="text-sm text-gray-600">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <a
            href="/cart"
            className="flex items-center justify-center gap-2 text-[#04322f] font-medium hover:text-[#03201e]"
          >
            <ShoppingBag className="w-4 h-4" />
            View Cart
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartToast;
