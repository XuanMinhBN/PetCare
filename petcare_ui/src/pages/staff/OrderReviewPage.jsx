import React, { useState, useEffect, useCallback } from "react";
import { checkoutAPI } from "../../services/api";

const OrderReviewPage = ({ onNavigate, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await checkoutAPI.getAllOrders();
      if (result.success) {
        const data = result.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.orders)
              ? data.orders
              : [];
        setOrders(list);
      } else {
        setError(result.error || "Không thể tải danh sách đơn hàng");
        setOrders([]);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const normalizeOrder = (order) => {
    const customerName =
      order.user?.name ||
      order.customerName ||
      order.user?.email ||
      "Khách hàng";
    const totalAmount = order.total ?? order.totalAmount ?? 0;
    const orderDate = order.createdAt ?? order.orderDate;
    const items = order.items || order.orderItems || [];
    return {
      id: order.id,
      orderNumber: order.orderNumber ?? `#${order.id}`,
      customerName,
      customerEmail: order.user?.email ?? order.customerEmail,
      totalAmount,
      orderDate,
      status: (order.status ?? "PENDING").toLowerCase(),
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      notes: order.notes,
      items: items.map((i) => ({
        name: i.product?.name ?? i.name ?? "Sản phẩm",
        quantity: i.quantity ?? i.qty ?? 1,
        price: i.price ?? i.unitPrice ?? 0,
      })),
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount ?? 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status) => {
    const normalizedStatus = status?.toLowerCase() || "pending";
    const map = {
      pending: {
        label: "Chờ xác nhận",
        className: "bg-yellow-100 text-yellow-800",
      },
      confirmed: {
        label: "Đã xác nhận",
        className: "bg-blue-100 text-blue-800",
      },
      paid: {
        label: "Đã thanh toán",
        className: "bg-cyan-100 text-cyan-800",
      },
      packing: {
        label: "Đang đóng gói",
        className: "bg-orange-100 text-orange-800",
      },
      shipped: {
        label: "Đang giao",
        className: "bg-purple-100 text-purple-800",
      },
      delivered: {
        label: "Đã giao",
        className: "bg-green-100 text-green-800",
      },
      completed: {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-800",
      },
      cancelled: {
        label: "Đã hủy",
        className: "bg-red-100 text-red-800",
      },
    };
    return (
      map[normalizedStatus] || {
        label: normalizedStatus || "Chờ xác nhận",
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(normalizeOrder(order));
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
    setConfirmMessage(null);
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return;

    try {
      setConfirming(true);
      setConfirmMessage(null);
      const result = await checkoutAPI.confirmOrder(selectedOrder.id);

      if (result.success) {
        setConfirmMessage({
          type: "success",
          text: "Xác nhận đơn hàng thành công!",
        });
        // Cập nhật danh sách orders
        setTimeout(() => {
          loadOrders();
          setSelectedOrder(null);
          setConfirmMessage(null);
        }, 1500);
      } else {
        setConfirmMessage({
          type: "error",
          text: result.error || "Xác nhận đơn hàng thất bại",
        });
      }
    } catch (err) {
      console.error("Error confirming order:", err);
      setConfirmMessage({
        type: "error",
        text: "Xác nhận đơn hàng thất bại",
      });
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  const displayOrders = orders.map(normalizeOrder);

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Duyệt đơn hàng
          </h1>
          <p className="text-sm text-gray-500">Tất cả đơn hàng từ khách</p>
          <div className="w-16 h-1 bg-emerald-600 mx-auto mt-2"></div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={loadOrders}
              className="text-red-700 underline text-sm font-medium"
            >
              Thử lại
            </button>
          </div>
        )}

        {!error && displayOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-gray-400 text-5xl mb-4">📦</div>
            <p className="text-gray-600">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  onClick={() =>
                    handleOrderClick(orders.find((o) => o.id === order.id))
                  }
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.className}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium mt-1 truncate">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </p>
                      <p className="text-sm font-medium text-emerald-600 mt-1">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
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
              );
            })}
          </div>
        )}
      </div>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleCloseDetail}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                Đơn hàng {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={handleCloseDetail}
                className="p-2 rounded-lg hover:bg-gray-200 text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Khách hàng
                </p>
                <p className="font-medium text-gray-900">
                  {selectedOrder.customerName}
                </p>
                {selectedOrder.customerEmail && (
                  <p className="text-sm text-gray-600">
                    {selectedOrder.customerEmail}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Ngày đặt
                </p>
                <p className="text-gray-800">
                  {formatDate(selectedOrder.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Sản phẩm
                </p>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-800">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-emerald-600 font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Địa chỉ giao hàng
                  </p>
                  <p className="text-gray-800 text-sm">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>
              )}
              {selectedOrder.notes && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Ghi chú
                  </p>
                  <p className="text-gray-800 text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">Tổng cộng</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Thanh toán:{" "}
                  {selectedOrder.paymentMethod === "payos"
                    ? "PayOS"
                    : selectedOrder.paymentMethod === "cod"
                      ? "COD"
                      : selectedOrder.paymentMethod || "—"}
                </p>
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <button
                onClick={handleCloseDetail}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Đóng
              </button>
              {selectedOrder.status === "pending" && (
                <button
                  onClick={handleConfirmOrder}
                  disabled={confirming}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {confirming ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    "✓ Xác nhận đơn"
                  )}
                </button>
              )}
              {selectedOrder.status !== "pending" && (
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                >
                  Đã xác nhận
                </button>
              )}
            </div>

            {/* Confirmation message */}
            {confirmMessage && (
              <div
                className={`p-4 text-center font-medium ${
                  confirmMessage.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {confirmMessage.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderReviewPage;
