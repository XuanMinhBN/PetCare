import React, { useState, useEffect, useCallback } from "react";
import { checkoutAPI } from "../services/api";

function Checkout({ onNavigate, onBack }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderData, setOrderData] = useState({
    shippingAddress: "",
    paymentMethod: "cod", // cod = cash on delivery
    notes: "",
  });

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const result = await checkoutAPI.getCart();
      console.log("Cart API result:", result); // Debug log
      if (result.success) {
        // Handle the actual API response structure: items.content[]
        const apiData = result.data;
        const items = apiData?.items?.content || [];
        console.log("Cart API data:", apiData); // Debug log
        console.log("Cart items from API:", items); // Debug log

        // Transform the data to match component expectations
        const transformedItems = items.map((item) => ({
          id: item.id,
          productId: item.product?.id,
          name: item.product?.name || "Unknown Product",
          price: item.price || item.product?.price || 0,
          quantity: item.qty || 1,
          image: item.product?.images || "🛒",
        }));

        setCartItems(transformedItems);
      } else {
        console.error("Failed to load cart:", result.error);
        setCartItems([]); // Ensure cartItems is always an array
        alert("Không thể tải giỏ hàng");
        onNavigate("shopping-cart");
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      setCartItems([]); // Ensure cartItems is always an array
      alert("Không thể tải giỏ hàng");
      onNavigate("cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  const getSubtotal = () => {
    if (!Array.isArray(cartItems)) {
      console.warn("cartItems is not an array:", cartItems);
      return 0;
    }
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getShippingFee = () => {
    return getSubtotal() >= 500000 ? 0 : 30000;
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    // Giả sử coupon giảm 10% tối đa 100k
    const discount = Math.min(getSubtotal() * 0.1, 100000);
    return discount;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingFee() - getDiscountAmount();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Vui lòng nhập mã coupon");
      return;
    }

    try {
      // Tạm thời set coupon thành công (trong thực tế sẽ gọi API)
      setAppliedCoupon({
        code: couponCode,
        discount: getDiscountAmount(),
      });
      setCouponCode("");
      alert("Áp dụng coupon thành công!");
    } catch (err) {
      alert("Mã coupon không hợp lệ hoặc đã hết hạn");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleInputChange = (field, value) => {
    setOrderData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateOrder = async () => {
    if (!orderData.shippingAddress.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    setProcessing(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        subtotal: getSubtotal(),
        shippingFee: getShippingFee(),
        discount: getDiscountAmount(),
        total: getTotal(),
        couponCode: appliedCoupon?.code,
      };

      const result = await checkoutAPI.createOrder(orderPayload);

      if (result.success) {
        alert("Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
        onNavigate("order-history");
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
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
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Thanh toán
        </h1>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Sản phẩm đặt mua
            </h2>
            <div className="space-y-3">
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image && item.image.startsWith("http") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span
                        className="text-2xl"
                        style={{
                          display:
                            item.image && item.image.startsWith("http")
                              ? "none"
                              : "block",
                        }}
                      >
                        {item.image || "🛒"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
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
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Giỏ hàng trống
                </div>
              )}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Mã giảm giá
            </h2>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div>
                  <p className="text-green-800 font-medium">
                    Coupon: {appliedCoupon.code}
                  </p>
                  <p className="text-green-600 text-sm">
                    Giảm {formatPrice(appliedCoupon.discount)}
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-600 hover:text-red-800"
                >
                  Xóa
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã coupon"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin giao hàng
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  value={orderData.shippingAddress}
                  onChange={(e) =>
                    handleInputChange("shippingAddress", e.target.value)
                  }
                  placeholder="Nhập địa chỉ giao hàng chi tiết"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú đơn hàng
                </label>
                <textarea
                  value={orderData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  value={orderData.paymentMethod}
                  onChange={(e) =>
                    handleInputChange("paymentMethod", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="bank">Chuyển khoản ngân hàng</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {formatPrice(getSubtotal())}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {getShippingFee() === 0
                    ? "Miễn phí"
                    : formatPrice(getShippingFee())}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span className="font-medium">
                    -{formatPrice(getDiscountAmount())}
                  </span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={processing}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
