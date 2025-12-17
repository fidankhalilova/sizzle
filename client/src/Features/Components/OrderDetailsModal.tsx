import React, { useState } from "react";
import {
  X,
  MapPin,
  CreditCard,
  DollarSign,
  FileText,
  CheckCircle,
  Copy,
  Printer,
  Download,
  Mail,
  Package,
  Phone,
  Check,
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
  statusConfig,
}) => {
  const [copiedText, setCopiedText] = useState<string>("");

  if (!isOpen) return null;

  const status = statusConfig[order.status];
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

  const getStatusProgress = () => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statuses.indexOf(order.status);
    return currentIndex >= 0 ? currentIndex + 1 : 0;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    console.log("Download invoice for order:", order.orderNumber);
    // Implement invoice download logic
  };

  const handleEmailInvoice = () => {
    console.log("Email invoice for order:", order.orderNumber);
    // Implement email invoice logic
  };

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
          {/* Header with linear */}
          <div className="sticky top-0 bg-linear-to-r from-[#04322f] via-[#045a52] to-[#04322f] text-white px-4 sm:px-6 py-4 sm:py-5 z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="p-2 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm shrink-0 shadow-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold truncate">
                    Order #{order.orderNumber.split("-").pop()}
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
                  <span className="absolute -bottom-8 right-0 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {copiedText === "Order ID" ? "Copied!" : "Copy ID"}
                  </span>
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
          <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
            <div className="p-4 sm:p-6">
              {/* Status Progress */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
                  Order Status Timeline
                </h3>
                <div className="relative">
                  {/* Status Steps */}
                  <div className="flex justify-between mb-4">
                    {["pending", "processing", "shipped", "delivered"].map(
                      (stepStatus, index) => {
                        const step = statusConfig[stepStatus as OrderStatus];
                        const currentProgress = getStatusProgress();
                        const isCompleted = index < currentProgress;
                        const isCurrent = order.status === stepStatus;

                        return (
                          <div
                            key={stepStatus}
                            className="flex flex-col items-center relative z-10 flex-1"
                          >
                            <div
                              className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                                isCompleted
                                  ? "bg-green-500 scale-110 shadow-lg"
                                  : "bg-gray-200"
                              } ${
                                isCurrent
                                  ? "ring-4 ring-green-200 animate-pulse"
                                  : ""
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                              ) : (
                                <div className="text-gray-400 scale-75 sm:scale-100">
                                  {step.icon}
                                </div>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-xs text-green-600 mt-1 font-semibold">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute top-4 sm:top-6 left-0 right-0 h-1 bg-gray-200 z-0">
                    <div
                      className="h-full bg-green-500 transition-all duration-700 ease-out"
                      style={{
                        width: `${
                          getStatusProgress() > 0
                            ? (getStatusProgress() - 1) * 33.33
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Status Description Card */}
                <div
                  className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl ${
                    status.bgColor
                  } ${
                    status.borderColor || "border-gray-200"
                  } border-2 shadow-md`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${status.bgColor.replace(
                        "50",
                        "100"
                      )}`}
                    >
                      {status.icon}
                    </div>
                    <div>
                      <p
                        className={`font-semibold text-sm sm:text-base ${status.color}`}
                      >
                        {status.label}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {status.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Order Items - Full Width on Mobile */}
                <div className="lg:col-span-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Items ({order.items.length})
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all border border-gray-200"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm sm:text-base text-gray-800 mb-2 truncate">
                            {item.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <span className="bg-white px-2 py-1 rounded shadow-sm">
                              Size: {item.size}
                            </span>
                            <span className="bg-white px-2 py-1 rounded shadow-sm">
                              Color: {item.color}
                            </span>
                            <span className="bg-white px-2 py-1 rounded shadow-sm">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <span className="font-bold text-sm sm:text-base text-[#04322f]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#04322f]" />
                    Shipping Address
                  </h3>
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-xl border-2 border-blue-200 shadow-md">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 mb-3">
                      {order.shippingAddress.fullName}
                    </p>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
                        <span>{order.shippingAddress.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 shrink-0"></span>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 shrink-0"></span>
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-blue-300 space-y-2">
                      <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                        <Mail className="w-4 h-4 text-blue-600" />
                        {order.shippingAddress.email}
                      </p>
                      <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-blue-600" />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment & Summary */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Payment Method */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#04322f]" />
                      Payment Method
                    </h3>
                    <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-xl border-2 border-purple-200 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base text-gray-600">
                          Method
                        </span>
                        <span className="font-semibold text-sm sm:text-base text-gray-800">
                          {order.paymentMethod === "credit_card"
                            ? "Credit Card"
                            : order.paymentMethod === "paypal"
                            ? "PayPal"
                            : order.paymentMethod === "cash_on_delivery"
                            ? "Cash on Delivery"
                            : order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#04322f]" />
                      Order Summary
                    </h3>
                    <div className="bg-linear-to-br from-green-50 to-green-100 p-4 sm:p-5 rounded-xl border-2 border-green-200 shadow-md space-y-3">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ${order.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                          ${order.shipping.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">
                          ${order.tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-green-300 font-bold text-base sm:text-lg">
                        <span className="text-gray-800">Total</span>
                        <span className="text-[#04322f]">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#04322f]" />
                        Order Notes
                      </h3>
                      <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-4 sm:p-5 rounded-xl border-2 border-yellow-200 shadow-md">
                        <p className="text-xs sm:text-sm text-gray-700">
                          {order.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
                onClick={handleDownloadInvoice}
                className="px-3 sm:px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Invoice</span>
              </button>
              <button
                onClick={handleEmailInvoice}
                className="px-3 sm:px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-xs sm:text-sm"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Email</span>
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

      {/* Add animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsModal;
