import React, { useState, useEffect } from "react";
import { checkoutAPI } from "../services/api";

function ShoppingCart({ onNavigate, onBack }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart data from API
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const result = await checkoutAPI.getCart();
      if (result.success) {
        // Xử lý cấu trúc response mới: { items: { content: [...] } }
        const cartData = result.data;
        let items = [];

        if (
          cartData &&
          cartData.items &&
          Array.isArray(cartData.items.content)
        ) {
          // Cấu trúc mới: items.content
          items = cartData.items.content.map((item) => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.qty,
            price: item.price,
            name: item.product.name,
            description: item.product.sku || "",
            image: item.product.images || "📦",
            product: item.product,
          }));
        } else if (Array.isArray(cartData)) {
          // Nếu API trả về array trực tiếp
          items = cartData;
        } else if (cartData && Array.isArray(cartData.items)) {
          // Nếu API trả về { items: [...] }
          items = cartData.items;
        } else if (cartData && Array.isArray(cartData.content)) {
          // Nếu API trả về { content: [...] }
          items = cartData.content;
        } else {
          items = [];
        }

        setCartItems(items);
      } else {
        setError(result.error);
        setCartItems([]); // Đảm bảo cartItems là array ngay cả khi có lỗi
      }
    } catch (err) {
      setError("Không thể tải giỏ hàng");
      setCartItems([]); // Đảm bảo cartItems là array ngay cả khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id, change) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    try {
      const result = await checkoutAPI.updateCartItem(id, {
        quantity: newQuantity,
      });
      if (result.success) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Không thể cập nhật số lượng");
    }
  };

  const handleRemoveItem = async (id) => {
    if (
      !window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      return;
    }

    try {
      const result = await checkoutAPI.removeFromCart(id);
      if (result.success) {
        setCartItems((items) => items.filter((item) => item.id !== id));
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán");
      return;
    }

    // Điều hướng đến trang checkout
    onNavigate("checkout");
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
          Giỏ hàng của bạn
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Đang tải giỏ hàng...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadCart}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Cart Items */}
        {!loading && !error && (
          <div className="space-y-4">
            {Array.isArray(cartItems) &&
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image && item.image.startsWith("http") ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span
                        className="text-4xl"
                        style={{
                          display:
                            item.image && item.image.startsWith("http")
                              ? "none"
                              : "block",
                        }}
                      >
                        {item.image || "📦"}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          SKU: {item.description}
                        </p>
                      )}

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Giá:</span>
                          <span className="font-medium">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Số lượng:</span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Thành tiền:</span>
                          <span className="font-medium text-green-600">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <span className="text-gray-600 text-sm">–</span>
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <span className="text-gray-600 text-sm">+</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 bg-red-100 rounded flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Total and Checkout */}
        {!loading &&
          !error &&
          Array.isArray(cartItems) &&
          cartItems.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">
                    Tạm tính:
                  </span>
                  <span className="text-lg font-medium text-gray-800">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">
                    Phí vận chuyển:
                  </span>
                  <span className="text-lg font-medium text-gray-800">
                    {getTotalPrice() >= 500000 ? "Miễn phí" : "30.000 ₫"}
                  </span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {formatPrice(
                        getTotalPrice() +
                          (getTotalPrice() >= 500000 ? 0 : 30000)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-medium hover:bg-green-700 transition-colors mt-4"
              >
                Tiến hành thanh toán
              </button>
            </div>
          )}

        {/* Empty State */}
        {!loading &&
          !error &&
          Array.isArray(cartItems) &&
          cartItems.length === 0 && (
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600 mb-4">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
              <button
                onClick={() => onNavigate("store")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default ShoppingCart;
