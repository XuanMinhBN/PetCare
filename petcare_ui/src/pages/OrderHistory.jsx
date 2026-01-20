import React, { useState, useEffect } from "react";
import { checkoutAPI } from "../services/api";

function OrderHistory({ onNavigate, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await checkoutAPI.getOrders();
      if (result.success) {
        // Đảm bảo orders luôn là array
        const ordersData = result.data;
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else if (ordersData && Array.isArray(ordersData.content)) {
          // Nếu API trả về { content: [...] }
          setOrders(ordersData.content);
        } else if (ordersData && Array.isArray(ordersData.orders)) {
          // Nếu API trả về { orders: [...] }
          setOrders(ordersData.orders);
        } else {
          setOrders([]);
        }
      } else {
        setError(result.error);
        setOrders([]); // Đảm bảo orders là array ngay cả khi có lỗi
      }
    } catch (err) {
      setError("Không thể tải lịch sử đơn hàng");
      setOrders([]); // Đảm bảo orders là array ngay cả khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      const result = await checkoutAPI.cancelOrder(orderId);
      if (result.success) {
        alert("Hủy đơn hàng thành công");
        loadOrders(); // Reload orders
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Không thể hủy đơn hàng");
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "shipped":
      case "shipping":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "Đã giao";
      case "shipped":
      case "shipping":
        return "Đang giao";
      case "confirmed":
      case "processing":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "pending":
      default:
        return "Chờ xác nhận";
    }
  };

  const canCancelOrder = (status) => {
    return status === "pending" || status === "confirmed";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-800 rounded-full ml-1"></div>
                  <div className="w-2 h-2 bg-green-800 rounded-full ml-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="bg-white rounded-lg p-2 shadow-lg"
          >
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="text-white font-bold text-xl flex items-center">
            <span>PETFIT</span>
            <div className="ml-1 w-2 h-2 bg-white rounded-full"></div>
          </div>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 bg-gray-100">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Lịch sử đơn hàng
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải lịch sử đơn hàng...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadOrders}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Order Items */}
        {!loading && !error && (
          <div className="space-y-4">
            {Array.isArray(orders) &&
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Đơn hàng #{order.orderNumber || order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ngày đặt:{" "}
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items &&
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">
                              {item.image || "📦"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Tổng cộng:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(order.total)}
                      </span>
                    </div>

                    {order.shippingAddress && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
                        {order.shippingAddress}
                      </div>
                    )}

                    {/* Cancel Button */}
                    {canCancelOrder(order.status) && (
                      <div className="mt-3">
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          Hủy đơn hàng
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && Array.isArray(orders) && orders.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn chưa có đơn hàng nào trong lịch sử
            </p>
            <button
              onClick={() => onNavigate("store")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Bắt đầu mua sắm
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Về trang chủ
          </button>

          <button
            onClick={() => onNavigate("store")}
            className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Đến cửa hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
