import React, { useState, useEffect } from "react";

const OrderReviewPage = ({ onNavigate, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - trong thực tế sẽ fetch từ API
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        customerName: "Nguyễn Văn A",
        orderDate: "2025-01-15",
        totalAmount: 450000,
        status: "pending",
        items: [
          { name: "Thức ăn cho chó Royal Canin", quantity: 2, price: 200000 },
          { name: "Đồ chơi cho mèo", quantity: 1, price: 50000 },
        ],
      },
      {
        id: 2,
        customerName: "Nguyễn Văn B",
        orderDate: "2025-01-15",
        totalAmount: 320000,
        status: "pending",
        items: [
          { name: "Sữa tắm cho thú cưng", quantity: 1, price: 120000 },
          { name: "Bàn chải đánh răng", quantity: 2, price: 100000 },
        ],
      },
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOrderClick = (orderId) => {
    // Trong thực tế sẽ navigate đến trang chi tiết đơn hàng
    alert(`Xem chi tiết đơn hàng ${orderId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header with back button */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-emerald-700">
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with back button */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-emerald-700">
        <button onClick={onBack} className="bg-white rounded-lg p-2 shadow-lg">
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

      <div className="px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Duyệt đơn hàng
          </h1>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg">
                Không có đơn hàng nào cần duyệt
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderClick(order.id)}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.customerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ngày đặt: {formatDate(order.orderDate)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Tổng tiền: {formatCurrency(order.totalAmount)}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mt-1">
                        Chờ duyệt
                      </span>
                    </div>
                  </div>
                  <div className="text-green-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderReviewPage;
