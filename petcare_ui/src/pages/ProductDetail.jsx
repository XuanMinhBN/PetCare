import React, { useState } from "react";
import { checkoutAPI } from "../services/api";

function ProductDetail({ onNavigate, onBack, productId = "whiskas" }) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const products = {
    whiskas: {
      name: "Thức ăn hạt cho mèo Whiskas",
      price: "250.000",
      image: "🟣", // Purple bag emoji to represent Whiskas
      description:
        "Thức ăn hạt cho mèo trưởng thành 1+ tuổi, vị cá ngừ thơm ngon",
    },
    collar: {
      name: "Vòng đeo cổ cho mèo Happy",
      price: "50.000",
      image: "🔴", // Red collar emoji
      description: "Vòng đeo cổ đẹp với chuông và phụ kiện trang trí",
    },
  };

  const currentProduct = products[productId] || products.whiskas;

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      const cartItemData = {
        productId: productId,
        quantity: quantity,
        price: parseInt(currentProduct.price.replace(/[^\d]/g, "")),
        name: currentProduct.name,
        description: currentProduct.description,
        image: currentProduct.image,
      };

      const result = await checkoutAPI.addToCart(cartItemData);

      if (result.success) {
        alert(`Đã thêm ${quantity} ${currentProduct.name} vào giỏ hàng!`);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert("Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
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

      {/* Product Display Area */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-square bg-gray-100 flex items-center justify-center p-8">
          <div className="text-9xl">{currentProduct.image}</div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-xl font-bold text-gray-800 flex-1">
            {currentProduct.name}
          </h1>
          <button onClick={handleToggleFavorite} className="ml-4 p-2">
            <svg
              className={`w-6 h-6 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "fill-none stroke-gray-400"
              }`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="text-2xl font-bold text-green-600 mb-4">
          {currentProduct.price} ₫
        </div>

        <p className="text-gray-600 text-sm mb-6">
          {currentProduct.description}
        </p>
      </div>

      {/* Add to Cart Section */}
      <div className="bg-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-green-600 font-medium">Cho vào giỏ hàng</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center hover:bg-gray-400 transition-colors"
            >
              <span className="text-gray-600 font-bold">–</span>
            </button>
            <div className="w-12 h-8 bg-white border border-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-800 font-medium">{quantity}</span>
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center hover:bg-gray-400 transition-colors"
            >
              <span className="text-gray-600 font-bold">+</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
        >
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
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            />
          </svg>
          <span className="font-medium">+</span>
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
