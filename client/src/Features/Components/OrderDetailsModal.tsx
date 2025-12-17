import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  CreditCard,
  DollarSign,
  FileText,
  Copy,
  Printer,
  Mail,
  Package,
  Phone,
  Check,
  AlertCircle,
} from "lucide-react";
import type { Order, OrderStatus } from "../../Types/types";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  statusConfig: Record<
    OrderStatus,
    {
      label: string;
      color: string;
      bgColor: string;
      borderColor?: string;
      icon: React.ReactNode;
      description: string;
    }
  >;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  // statusConfig,
}) => {
  // All hooks must be called unconditionally (before any returns)
  const [copiedText, setCopiedText] = useState<string>("");
  // const [expandedNotes, setExpandedNotes] = useState(false);
  // const [notesLines, setNotesLines] = useState(3);

  // // Check notes length for truncation
  // useEffect(() => {
  //   if (order.notes && order.notes.length > 150) {
  //     setNotesLines(3);
  //   } else {
  //     setNotesLines(0);
  //   }
  // }, [order.notes]);

  // Debug shipping address (only when modal is open)
  useEffect(() => {
    if (isOpen && order) {
      console.log("🔍 DEBUG Shipping Address in Modal:", {
        hasShippingAddress: !!order.shippingAddress,
        shippingAddress: order.shippingAddress,
        type: typeof order.shippingAddress,
        keys: order.shippingAddress
          ? Object.keys(order.shippingAddress)
          : "none",
      });
    }
  }, [order, isOpen]);

  // Calculate status progress
  // const getStatusProgress = () => {
  //   const statuses = ["pending", "processing", "shipped", "delivered"];
  //   const currentIndex = statuses.indexOf(order.status);
  //   return currentIndex >= 0 ? currentIndex + 1 : 0;
  // };

  // Handle copy to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  // Payment method formatter
  const getPaymentMethodLabel = (method: string) => {
    switch (method?.toLowerCase()) {
      case "credit_card":
        return "Credit / Debit Card";
      case "paypal":
        return "PayPal";
      case "cash_on_delivery":
        return "Cash on Delivery";
      default:
        return method || "Not specified";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // const handleDownloadInvoice = () => {
  //   console.log("Download invoice for order:", order.orderNumber);
  // };

  // const handleEmailInvoice = () => {
  //   console.log("Email invoice for order:", order.orderNumber);
  // };

  // Early return must be AFTER all hooks
  if (!isOpen) return null;

  // const status = statusConfig[order.status] || statusConfig.pending;
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-[#04322f] via-[#045a52] to-[#04322f] text-white px-4 sm:px-6 py-4 sm:py-5 z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="p-2 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm shrink-0 shadow-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(order.orderNumber, "Order ID")}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0 relative group"
                  title="Copy Order ID"
                >
                  {copiedText === "Order ID" ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                  ) : (
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)] p-4 sm:p-6">
            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all border border-gray-200"
                    >
                      <img
                        src={item.image || "/api/placeholder/80/80"}
                        alt={item.name || "Product"}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2">
                          {item.name || "Unnamed Product"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                          {item.size && (
                            <span className="bg-white px-2 py-1 rounded shadow-sm">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="bg-white px-2 py-1 rounded shadow-sm">
                              Color: {item.color}
                            </span>
                          )}
                          <span className="bg-white px-2 py-1 rounded shadow-sm">
                            Qty: {item.quantity || 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-sm sm:text-base text-[#04322f]">
                            $
                            {((item.price || 0) * (item.quantity || 1)).toFixed(
                              2
                            )}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            ${(item.price || 0).toFixed(2)} each
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No items found in this order
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address & Payment Method */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Shipping Address */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#04322f]" />
                  Shipping Address
                </h3>
                <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-xl border-2 border-blue-200 shadow-md">
                  {order.shippingAddress && order.shippingAddress.fullName ? (
                    <>
                      <p className="font-semibold text-sm sm:text-base text-gray-800 mb-3">
                        {order.shippingAddress.fullName}
                      </p>
                      <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                        <p>{order.shippingAddress.address}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode}
                        </p>
                        <p>
                          {order.shippingAddress.country || "United States"}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t-2 border-blue-300 space-y-2">
                        <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-blue-600" />
                          {order.shippingAddress.email || order.userEmail}
                        </p>
                        {order.shippingAddress.phone && (
                          <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                            <Phone className="w-4 h-4 text-blue-600" />
                            {order.shippingAddress.phone}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        No shipping address available
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Address data not found in order response
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method & Summary */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#04322f]" />
                  Payment Method
                </h3>
                <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-xl border-2 border-purple-200 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm sm:text-base text-gray-600">
                      Method
                    </span>
                    <span className="font-semibold text-sm sm:text-base text-gray-800">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                  {order.paymentMethod === "credit_card" && (
                    <p className="text-xs text-gray-500">
                      Your card has been charged successfully
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#04322f]" />
                    Order Summary
                  </h3>
                  <div className="bg-linear-to-br from-green-50 to-green-100 p-4 sm:p-5 rounded-xl border-2 border-green-200 shadow-md space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ${order.subtotal?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        ${order.shipping?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">
                        ${order.tax?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 border-t-2 border-green-300 font-bold text-base sm:text-lg">
                      <span className="text-gray-800">Total</span>
                      <span className="text-[#04322f]">
                        ${order.total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && order.notes.trim() ? (
              <div className="mb-13">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#04322f]" />
                  Order Notes
                </h3>
                <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-4 sm:p-5 rounded-xl border-2 border-yellow-200 shadow-md">
                  <div className="relative">
                    <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap wrap-break-word">
                      {order.notes}
                    </p>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Note
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Order Notes
                </h3>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-xl border-2 border-gray-200">
                  <p className="text-sm sm:text-base text-gray-500 italic">
                    No special instructions provided
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handlePrint}
                className="px-3 sm:px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs sm:text-sm"
              >
                <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="ml-auto px-4 sm:px-6 py-2 bg-linear-to-r from-[#04322f] to-[#045a52] text-white rounded-lg font-medium hover:from-[#03201e] hover:to-[#04322f] transition-all shadow-md text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
