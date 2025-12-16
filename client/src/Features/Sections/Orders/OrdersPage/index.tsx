import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../../Store/hooks";
import { orderService } from "../../../../Services/api";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Home,
  X,
  Search,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Copy,
  AlertCircle,
} from "lucide-react";
import type { Order, OrderStatus } from "../../../../Types/types";
import OrderDetailsModal from "../../../Components/OrderDetailsModal";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Status configurations
  const statusConfig: Record<
    OrderStatus,
    {
      label: string;
      color: string;
      bgColor: string;
      icon: React.ReactNode;
      description: string;
    }
  > = {
    pending: {
      label: "Pending",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      icon: <Clock className="w-4 h-4" />,
      description: "Order received, awaiting processing",
    },
    processing: {
      label: "Processing",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      icon: <Package className="w-4 h-4" />,
      description: "Order is being prepared",
    },
    shipped: {
      label: "Shipped",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      icon: <Truck className="w-4 h-4" />,
      description: "Order is on the way",
    },
    delivered: {
      label: "Delivered",
      color: "text-green-700",
      bgColor: "bg-green-50",
      icon: <CheckCircle className="w-4 h-4" />,
      description: "Order has been delivered",
    },
    cancelled: {
      label: "Cancelled",
      color: "text-red-700",
      bgColor: "bg-red-50",
      icon: <X className="w-4 h-4" />,
      description: "Order has been cancelled",
    },
  };

  // Fetch orders
  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await orderService.getOrdersByEmail(user.email);
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email, isAuthenticated, navigate]);

  // Filter and sort orders
  useEffect(() => {
    let result = [...orders];

    // Filter by status
    if (selectedStatus !== "all") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.items.some((item) => item.name.toLowerCase().includes(query)) ||
          order.shippingAddress.fullName.toLowerCase().includes(query)
      );
    }

    // Sort orders
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(result);
  }, [orders, selectedStatus, searchQuery, sortBy]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    // You could add a toast notification here
  };

  const getOrderCountByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status).length;
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your orders
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04322f] mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#04322f] hover:text-[#b94e31] transition-colors mb-6"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your orders in one place
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-[#04322f]">{totalOrders}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-[#04322f]">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div
            key={status}
            className={`${
              config.bgColor
            } rounded-xl p-4 cursor-pointer hover:opacity-90 transition-opacity ${
              selectedStatus === status ? "ring-2 ring-[#04322f]" : ""
            }`}
            onClick={() => setSelectedStatus(status as OrderStatus)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`p-2 rounded-lg ${config.bgColor.replace(
                  "50",
                  "100"
                )}`}
              >
                {config.icon}
              </div>
              <span className={`font-semibold ${config.color}`}>
                {config.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {getOrderCountByStatus(status as OrderStatus)}
            </p>
            <p className="text-xs text-gray-600 mt-1">{config.description}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by order number, product, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as OrderStatus | "all")
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#04322f] text-white rounded-lg hover:bg-[#03201e] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {orders.length === 0
                ? "No orders yet"
                : "No orders match your filters"}
            </h3>
            <p className="text-gray-500 mb-6">
              {orders.length === 0
                ? "Start shopping to see your orders here"
                : "Try changing your search or filter criteria"}
            </p>
            {orders.length === 0 && (
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${status.bgColor}`}>
                        {status.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            Order #{order.orderNumber}
                          </h3>
                          <button
                            onClick={() =>
                              handleCopyOrderNumber(order.orderNumber)
                            }
                            className="text-gray-400 hover:text-[#04322f] transition-colors"
                            title="Copy order number"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">
                          Placed on {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                      <p className="text-2xl font-bold text-[#04322f]">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="shrink-0">
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              {item.quantity > 1 && (
                                <div className="absolute -top-2 -right-2 bg-[#b94e31] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                  {item.quantity}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="shrink-0">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600 font-semibold">
                                +{order.items.length - 3} more
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-6 py-3 bg-[#04322f] text-white rounded-lg font-medium hover:bg-[#03201e] transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        View Details
                      </button>

                      {order.status === "shipped" && (
                        <button className="px-6 py-3 border border-[#04322f] text-[#04322f] rounded-lg font-medium hover:bg-[#04322f] hover:text-white transition-colors flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          Track Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.paymentMethod === "credit_card"
                          ? "Credit Card"
                          : order.paymentMethod === "paypal"
                          ? "PayPal"
                          : order.paymentMethod === "cash_on_delivery"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 truncate">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {orderDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          order={selectedOrder}
          statusConfig={statusConfig}
        />
      )}
    </div>
  );
};

export default MyOrders;
