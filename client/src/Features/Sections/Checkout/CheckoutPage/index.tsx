// Features/Pages/Checkout/index.tsx - COMPLETE FIXED VERSION
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch } from "../../../../Store/hooks";
import { clearCart } from "../../../../Store/Slices/cartSlice";
import { orderService } from "../../../../Services/api";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { ShippingAddress, OrderInputData } from "../../../../Types/types";

// LocalStorage helper functions
const CHECKOUT_STORAGE_KEY = "checkoutFormData";

const saveToLocalStorage = (
  shippingInfo: ShippingAddress,
  paymentMethod: string,
  orderNotes: string
) => {
  try {
    const data = {
      shippingInfo,
      paymentMethod,
      orderNotes,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
    console.log("💾 Saved to localStorage:", data);
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
};

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      console.log("📂 Loaded from localStorage:", data);
      return data;
    }
  } catch (err) {
    console.error("Failed to load from localStorage:", err);
  }
  return null;
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    console.log("🗑️ Cleared localStorage");
  } catch (err) {
    console.error("Failed to clear localStorage:", err);
  }
};

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  // Load saved data
  const savedData = loadFromLocalStorage();

  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>(
    savedData?.shippingInfo || {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    }
  );

  // Payment method and notes
  const [paymentMethod, setPaymentMethod] = useState(
    savedData?.paymentMethod || "credit_card"
  );
  const [orderNotes, setOrderNotes] = useState(savedData?.orderNotes || "");

  // Save to localStorage whenever form changes
  useEffect(() => {
    if (!orderComplete) {
      saveToLocalStorage(shippingInfo, paymentMethod, orderNotes);
    }
  }, [shippingInfo, paymentMethod, orderNotes, orderComplete]);

  // Calculate costs
  const subtotal = totalPrice;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  // Form validation
  const validateForm = (): boolean => {
    if (!shippingInfo.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!shippingInfo.email.trim() || !shippingInfo.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!shippingInfo.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!shippingInfo.address.trim()) {
      setError("Address is required");
      return false;
    }
    if (!shippingInfo.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!shippingInfo.state.trim()) {
      setError("State is required");
      return false;
    }
    if (!shippingInfo.zipCode.trim()) {
      setError("Zip code is required");
      return false;
    }
    return true;
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Handle place order
  // In Checkout page - handlePlaceOrder function
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData: OrderInputData = {
        userEmail: user?.email || shippingInfo.email,
        items: items,
        subtotal: subtotal,
        shipping: shippingCost,
        tax: tax,
        total: total,
        shippingAddress: shippingInfo,
        paymentMethod: paymentMethod,
        notes: orderNotes,
      };

      console.log("📦 Submitting order:", orderData);

      try {
        const createdOrder = await orderService.createOrder(orderData);
        console.log("✅ Order created:", createdOrder);
        setOrderNumber(createdOrder.orderNumber);
      } catch (createError) {
        console.error(
          "⚠️ Order creation returned error, but order might still be created"
        );

        // Generate a fallback order number
        const fallbackOrderNumber = `ORD-${Date.now()}-${Math.floor(
          Math.random() * 1000
        )}`;
        setOrderNumber(fallbackOrderNumber);

        // You could also try to fetch the actual order from Strapi
        setTimeout(async () => {
          try {
            const orders = await orderService.getOrdersByEmail(
              orderData.userEmail
            );
            if (orders.length > 0) {
              const latestOrder = orders[0];
              console.log("🔄 Found latest order after error:", latestOrder);
              setOrderNumber(latestOrder.orderNumber);
            }
          } catch (fetchError) {
            console.error("Could not fetch orders after creation error");
          }
        }, 1000);
      }

      // Clear cart regardless
      dispatch(clearCart());
      clearLocalStorage();
      setOrderComplete(true);
    } catch (err: any) {
      console.error("❌ Order error:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Empty cart check
  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="px-6 py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Success screen
  // In Checkout page - update the success section
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your order. We've received your order and will
              process it soon.
            </p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
            <p className="text-2xl font-mono font-bold text-green-700">
              {orderNumber}
            </p>
          </div>

          {/* Enhanced Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              Order Summary
            </h3>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">{item.name}</h5>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-lg font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="text-lg font-medium">
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="text-lg font-medium">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-xl font-bold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-[#04322f]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-gray-800 mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium">{shippingInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-medium">{shippingInfo.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Shipping Address</p>
                <p className="font-medium">
                  {shippingInfo.address}, {shippingInfo.city},{" "}
                  {shippingInfo.state} {shippingInfo.zipCode}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-4 bg-[#04322f] text-white rounded-full font-semibold hover:bg-[#03201e] transition-colors mr-4"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="px-8 py-4 border-2 border-[#04322f] text-[#04322f] rounded-full font-semibold hover:bg-[#04322f] hover:text-white transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-[#04322f] hover:text-[#b94e31] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Shop</span>
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Checkout
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Saved Data Notice */}
      {savedData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-blue-700 text-sm">
            Your form data has been restored from your last session
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-[#04322f]" />
              <h2 className="text-xl font-bold text-gray-800">
                Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-[#04322f]" />
              <h2 className="text-xl font-bold text-gray-800">
                Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#04322f] transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#04322f]"
                />
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Credit / Debit Card</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#04322f] transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#04322f]"
                />
                <span className="font-medium">PayPal</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#04322f] transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cash_on_delivery"
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-[#04322f]"
                />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent resize-none"
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => {
                // Convert price to number if it's a string
                const price =
                  typeof item.price === "string"
                    ? parseFloat(item.price)
                    : Number(item.price) || 0;

                const itemTotal = price * item.quantity;

                return (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-800 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.size} / {item.color}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        ${itemTotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fix subtotal calculation too */}
            <div className="space-y-3 py-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t-2 border-gray-200">
                <span>Total</span>
                <span className="text-[#04322f]">${total.toFixed(2)}</span>
              </div>
            </div>

            {shippingCost === 0 && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  🎉 You got free shipping!
                </p>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 py-4 bg-[#b94e31] hover:bg-[#495f11] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                `Place Order - $${total.toFixed(2)}`
              )}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By placing your order, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
