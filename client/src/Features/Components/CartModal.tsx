// src/Features/Components/CartModal.tsx
import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../Store/Slices/cartSlice";
import { useNavigate } from "react-router";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    items: cartItems,
    totalItems,
    totalPrice,
  } = useAppSelector((state) => state.cart);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate shipping (example: free over $100)
  const shippingFee = totalPrice >= 100 ? 0 : 9.99;
  const finalTotal = totalPrice + shippingFee;

  const handleRemoveItem = (id: number, size: string, color: string) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  const handleUpdateQuantity = (
    id: number,
    size: string,
    color: string,
    quantity: number
  ) => {
    const newQuantity = Math.max(1, quantity);
    dispatch(updateQuantity({ id, size, color, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      onClose();
      // Store current URL for redirect after login
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      // Show login modal or redirect to login
      navigate("/login");
      return;
    }

    setIsCheckingOut(true);
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
  };

  const handleLoginClick = () => {
    onClose();
    navigate("/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Cart Modal with slide animation */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[#04322f]" />
            <div>
              <h2 className="text-2xl font-bold text-[#04322f]">
                Your Cart ({totalItems})
              </h2>
              <p className="text-sm text-gray-500">
                {cartItems.length} unique item
                {cartItems.length !== 1 ? "s" : ""}
                {cartItems.length > 0 &&
                  (isAuthenticated
                    ? " • Saved to your account"
                    : " • Saved locally")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="relative mb-6">
                <ShoppingBag className="w-24 h-24 text-gray-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-8 max-w-xs">
                Looks like you haven't added any products to your cart yet.
              </p>

              <button
                onClick={handleContinueShopping}
                className="px-8 py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Authentication Warning */}
              {!isAuthenticated && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">
                        Sign in to save your cart to your account
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Your items are saved locally. Sign in to access them
                        from any device and proceed to checkout.
                      </p>
                      <button
                        onClick={handleLoginClick}
                        className="mt-2 text-sm text-[#04322f] font-medium hover:underline"
                      >
                        Sign in now →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-4 pb-6 border-b last:border-b-0 group"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                      {/* Quick remove button on hover */}
                      <button
                        onClick={() =>
                          handleRemoveItem(item.id, item.size, item.color)
                        }
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.id, item.size, item.color)
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Size and Color */}
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          Size: <span className="font-medium">{item.size}</span>
                        </span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          Color:{" "}
                          <span className="font-medium">{item.color}</span>
                        </span>
                      </div>

                      {/* Quantity Controls and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.size,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#04322f]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                              ${item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer - Summary and Actions */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-6">
            {/* Summary */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {totalPrice < 100 && shippingFee > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                </div>
              )}

              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total</span>
                <div>
                  <span className="text-[#04322f]">
                    ${finalTotal.toFixed(2)}
                  </span>
                  <div className="text-xs text-gray-500 font-normal">
                    Including taxes
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
              >
                {isCheckingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : !isAuthenticated ? (
                  "Sign in to Checkout"
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleClearCart}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="flex-1 py-3 border border-[#04322f] text-[#04322f] rounded-full font-medium hover:bg-[#04322f] hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Promo Code & Info */}
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <span className="font-medium">Free shipping</span> on orders
                  over $100
                </p>
                <p className="text-xs text-gray-500">
                  Returns accepted within 30 days •{" "}
                  {isAuthenticated
                    ? "Cart saved to your account"
                    : "Cart saved locally"}
                </p>
              </div>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Secure</div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-4 h-4 border-2 border-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">SSL</div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="text-xs font-bold text-gray-700">SSL</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Saved</div>
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="text-xs font-bold text-gray-700">✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
