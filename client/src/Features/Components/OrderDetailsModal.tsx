import React from "react";
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download logic
    console.log("Download invoice for order:", order.orderNumber);
  };

  const handleEmailInvoice = () => {
    // Implement email invoice logic
    console.log("Email invoice for order:", order.orderNumber);
  };

  const handleCopyOrderDetails = () => {
    const details = `
Order Number: ${order.orderNumber}
Date: ${formattedDate}
Status: ${status.label}
Total: $${order.total.toFixed(2)}
Payment Method: ${order.paymentMethod}
Shipping Address: ${order.shippingAddress.address}, ${
      order.shippingAddress.city
    }, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
    `.trim();
    navigator.clipboard.writeText(details);
    // Add toast notification
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${status.bgColor}`}>
                  {status.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyOrderDetails}
                  className="p-2 text-gray-500 hover:text-[#04322f] transition-colors"
                  title="Copy order details"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6">
              {/* Status Timeline */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Status
                </h3>
                <div className="relative">
                  {/* Status Steps */}
                  <div className="flex justify-between mb-2">
                    {["pending", "processing", "shipped", "delivered"].map(
                      (stepStatus, _index) => {
                        const step = statusConfig[stepStatus as OrderStatus];
                        const isCompleted =
                          stepStatus === "pending"
                            ? true
                            : stepStatus === "processing"
                            ? ["processing", "shipped", "delivered"].includes(
                                order.status
                              )
                            : stepStatus === "shipped"
                            ? ["shipped", "delivered"].includes(order.status)
                            : stepStatus === "delivered"
                            ? order.status === "delivered"
                            : false;
                        const isCurrent = order.status === stepStatus;

                        return (
                          <div
                            key={stepStatus}
                            className="flex flex-col items-center relative z-10"
                          >
                            <div
                              className={`
                            w-12 h-12 rounded-full flex items-center justify-center mb-2
                            ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                            ${isCurrent ? "ring-4 ring-green-200" : ""}
                          `}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : (
                                step.icon
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {step.label}
                            </span>
                            {isCurrent && (
                              <span className="text-xs text-gray-500 mt-1">
                                Current
                              </span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{
                        width:
                          order.status === "pending"
                            ? "25%"
                            : order.status === "processing"
                            ? "50%"
                            : order.status === "shipped"
                            ? "75%"
                            : order.status === "delivered"
                            ? "100%"
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-lg ${status.bgColor}`}>
                  <div className="flex items-center gap-3">
                    {status.icon}
                    <div>
                      <p className={`font-semibold ${status.color}`}>
                        {status.label}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {status.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-medium text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary & Details */}
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-800">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.country}
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Email:</span>{" "}
                          {order.shippingAddress.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Phone:</span>{" "}
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Order Summary */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Details
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="font-medium">
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

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Order Summary
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span>${order.shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-lg">
                          <span>Total</span>
                          <span className="text-[#04322f]">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Order Notes
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-600">{order.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              <button
                onClick={handleEmailInvoice}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Invoice
              </button>
              <button
                onClick={onClose}
                className="ml-auto px-6 py-2 bg-[#04322f] text-white rounded-lg font-medium hover:bg-[#03201e] transition-colors"
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
