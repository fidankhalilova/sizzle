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
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import type { Order, OrderStatus } from "../../../../Types/types";
import OrderDetailsModal from "../../../Components/OrderDetailsModal";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
      borderColor: string;
      icon: React.ReactNode;
      description: string;
    }
  > = {
    pending: {
      label: "Pending",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: <Clock className="w-4 h-4" />,
      description: "Order received, awaiting processing",
    },
    processing: {
      label: "Processing",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: <Package className="w-4 h-4" />,
      description: "Order is being prepared",
    },
    shipped: {
      label: "Shipped",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: <Truck className="w-4 h-4" />,
      description: "Order is on the way",
    },
    delivered: {
      label: "Delivered",
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: <CheckCircle className="w-4 h-4" />,
      description: "Order has been delivered",
    },
    cancelled: {
      label: "Cancelled",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: <X className="w-4 h-4" />,
      description: "Order has been cancelled",
    },
  };

  // Fetch orders function
  const fetchOrders = async () => {
    if (!user?.email) return;

    try {
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

  // Refresh orders function
  const refreshOrders = async () => {
    if (!user?.email) return;

    setRefreshing(true);
    try {
      const fetchedOrders = await orderService.getOrdersByEmail(user.email);
      setOrders(fetchedOrders);

      // Force re-filter and re-sort after refresh
      let result = [...fetchedOrders];

      // Apply current filters
      if (selectedStatus !== "all") {
        result = result.filter((order) => order.status === selectedStatus);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(query) ||
            order.items.some((item) =>
              item.name.toLowerCase().includes(query)
            ) ||
            order.shippingAddress.fullName.toLowerCase().includes(query)
        );
      }

      // Apply current sorting
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });

      setFilteredOrders(result);
      console.log("Orders refreshed and re-sorted successfully", {
        total: fetchedOrders.length,
        filtered: result.length,
        sortBy,
        selectedStatus,
      });
    } catch (err: any) {
      console.error("Error refreshing orders:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [user?.email, isAuthenticated]);

  // Auto-refresh every 30 seconds to catch Strapi updates
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    const interval = setInterval(() => {
      console.log("Auto-refreshing orders...");
      refreshOrders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user?.email, isAuthenticated, selectedStatus, searchQuery, sortBy]); // Add dependencies

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#04322f] hover:text-[#b94e31] transition-colors mb-4 sm:mb-6"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">
              Back to Home
            </span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                My Orders
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Track and manage all your orders
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-center sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-[#04322f]">
                  {totalOrders}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500">Total Spent</p>
                <p className="text-xl sm:text-2xl font-bold text-[#04322f]">
                  ${totalSpent.toFixed(2)}
                </p>
              </div>
              <button
                onClick={refreshOrders}
                disabled={refreshing}
                className="p-2 sm:p-3 bg-[#04322f] text-white rounded-lg hover:bg-[#03201e] transition-colors disabled:opacity-50"
                title="Refresh orders"
              >
                <RefreshCw
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              className={`${config.bgColor} ${
                config.borderColor
              } border-2 rounded-xl p-3 sm:p-4 cursor-pointer hover:opacity-90 transition-all ${
                selectedStatus === status
                  ? "ring-2 ring-[#04322f] scale-105"
                  : ""
              }`}
              onClick={() =>
                setSelectedStatus(
                  status === selectedStatus ? "all" : (status as OrderStatus)
                )
              }
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`p-1.5 sm:p-2 rounded-lg ${config.bgColor.replace(
                    "50",
                    "100"
                  )}`}
                >
                  {config.icon}
                </div>
                <span
                  className={`font-semibold text-xs sm:text-sm ${config.color}`}
                >
                  {config.label}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                {getOrderCountByStatus(status as OrderStatus)}
              </p>
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search orders by order number, product, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
              />
            </div>

            <div className="flex gap-2 sm:gap-4">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as OrderStatus | "all")
                }
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
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
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
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
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                {orders.length === 0
                  ? "No orders yet"
                  : "No orders match your filters"}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
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
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <div
                          className={`p-2 sm:p-3 rounded-lg ${status.bgColor} shrink-0`}
                        >
                          {status.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                              #{order.orderNumber.split("-").pop()}
                            </h3>
                            <button
                              onClick={() =>
                                handleCopyOrderNumber(order.orderNumber)
                              }
                              className="text-gray-400 hover:text-[#04322f] transition-colors shrink-0"
                              title="Copy order number"
                            >
                              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${status.color} ${status.bgColor}`}
                        >
                          {status.icon}
                          {status.label}
                        </span>
                        <p className="text-lg sm:text-2xl font-bold text-[#04322f]">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="shrink-0">
                              <div className="relative">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                                />
                                {item.quantity > 1 && (
                                  <div className="absolute -top-2 -right-2 bg-[#b94e31] text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                    {item.quantity}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="shrink-0">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-xs sm:text-sm text-gray-600 font-semibold">
                                  +{order.items.length - 3}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewOrder(order)}
                        className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#04322f] text-white rounded-lg font-medium hover:bg-[#03201e] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <FileText className="w-4 h-4" />
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          {order.paymentMethod === "credit_card"
                            ? "Card"
                            : order.paymentMethod === "paypal"
                            ? "PayPal"
                            : "COD"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
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
