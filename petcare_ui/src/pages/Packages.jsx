import React from "react";

function Packages({ onNavigate, onBack }) {
  const handleRegister = () => {
    alert("Đăng ký gói thành công!");
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
      <div className="p-6 bg-gray-100">
        <h1 className="text-center text-3xl font-bold text-green-600 mb-2">
          Gói cao cấp
        </h1>
        <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>

        {/* Package Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-green-600 mb-6">
              GÓI TIÊU CHUẨN
            </h2>

            {/* Price */}
            <div className="bg-green-600 text-white text-3xl font-bold py-4 px-8 rounded-lg inline-block mb-6">
              39.000
            </div>

            <p className="text-gray-600 mb-8">VNĐ/tháng</p>
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Theo dõi sức khỏe</span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Lịch nhắc chăm sóc</span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Lưu album ảnh thú cưng</span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">Báo cáo sức khỏe</span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Gợi ý thức ăn & dinh dưỡng cá nhân hóa
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Lên kế hoạch chăm sóc thông minh
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Gợi ý phòng khám thú y gần bạn
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">
                Hỏi chuyên gia thú y (1 lần/tháng)
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-green-600 text-white text-xl font-bold py-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
          >
            ĐĂNG KÝ
          </button>
        </div>

        {/* Additional Package Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Premium Package */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Gói Premium
            </h3>
            <div className="text-2xl font-bold text-green-600 mb-4">
              79.000 VNĐ/tháng
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>• Tất cả tính năng Gói Tiêu chuẩn</li>
              <li>• Tư vấn 24/7</li>
              <li>• Ưu tiên đặt lịch</li>
              <li>• Hỗ trợ video call</li>
            </ul>
            <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Nâng cấp
            </button>
          </div>

          {/* VIP Package */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Gói VIP</h3>
            <div className="text-2xl font-bold text-green-600 mb-4">
              199.000 VNĐ/tháng
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>• Tất cả tính năng Premium</li>
              <li>• Bác sĩ riêng</li>
              <li>• Khám tại nhà</li>
              <li>• Hỗ trợ khẩn cấp 24/7</li>
            </ul>
            <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Nâng cấp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Packages;
