import React, { useEffect, useState } from "react";
import { checkoutAPI } from "../services/api";

function PaymentSuccess({ onNavigate, onBack }) {
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin đơn hàng từ URL params hoặc localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("orderId");
    
    // Xóa orderId khỏi URL để bảo mật
    if (orderId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      loadOrderInfo(orderId);
    } else {
      setLoading(false);
    }
  }, []);

  const loadOrderInfo = async (orderId) => {
    try {
      const result = await checkoutAPI.getOrderById(orderId);
      if (result.success) {
        setOrderInfo(result.data);
      }
    } catch (err) {
      console.error("Error loading order info:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và sẽ
              được xử lý sớm nhất.
            </p>
          </div>

          {/* Order Info */}
          {orderInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Thông tin đơn hàng
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium text-gray-800">
                    #{orderInfo.id || orderInfo.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(orderInfo.total || orderInfo.totalAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="font-medium text-gray-800">
                    {orderInfo.paymentMethod === "payos"
                      ? "Thanh toán online (PayOS)"
                      : orderInfo.paymentMethod === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : "Chuyển khoản"}
                  </span>
                </div>
                {orderInfo.shippingAddress && (
                  <div>
                    <span className="text-gray-600">Địa chỉ giao hàng:</span>
                    <p className="font-medium text-gray-800 mt-1">
                      {orderInfo.shippingAddress}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate("order-history")}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Xem lịch sử đơn hàng
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="w-full bg-gray-200 text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
