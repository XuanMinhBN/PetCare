import React from "react";

function BookingConfirmation({ onNavigate, onBack, appointmentData }) {
  const handleGoHome = () => {
    onNavigate("home");
  };

  const handleViewBookings = () => {
    onNavigate("booking-history");
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
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-green-600"
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
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Đặt lịch thành công!
          </h1>
          <p className="text-gray-600">
            Lịch chăm sóc thú cưng của bạn đã được ghi nhận
          </p>
        </div>

        {/* Appointment Details */}
        {appointmentData && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Chi tiết cuộc hẹn
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã cuộc hẹn:</span>
                <span className="font-semibold text-gray-800">
                  #{appointmentData.id || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thú cưng:</span>
                <span className="font-semibold text-gray-800">
                  {appointmentData.pet?.name || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dịch vụ:</span>
                <span className="font-semibold text-gray-800">
                  {appointmentData.service?.name || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-semibold text-gray-800">
                  {appointmentData.timeSlot
                    ? new Date(appointmentData.timeSlot).toLocaleString("vi-VN")
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Giá:</span>
                <span className="font-semibold text-green-600">
                  {appointmentData.price?.toLocaleString("vi-VN") || "N/A"} VNĐ
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Địa chỉ:</span>
                <span className="font-semibold text-gray-800 text-right">
                  {appointmentData.address
                    ? `${appointmentData.address.line1}, ${appointmentData.address.ward}, ${appointmentData.address.district}, ${appointmentData.address.province}`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    appointmentData.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : appointmentData.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {appointmentData.status === "PENDING"
                    ? "Chờ xác nhận"
                    : appointmentData.status === "CONFIRMED"
                    ? "Đã xác nhận"
                    : appointmentData.status || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Thông tin quan trọng
              </h3>
              <ul className="text-blue-700 space-y-1">
                <li>
                  • Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận
                </li>
                <li>• Vui lòng chuẩn bị thú cưng sẵn sàng cho buổi chăm sóc</li>
                <li>• Bạn có thể hủy hoặc thay đổi lịch hẹn trước 2 giờ</li>
                <li>
                  • Thanh toán sẽ được thực hiện sau khi hoàn thành dịch vụ
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-green-600 text-white text-lg font-bold py-4 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
          >
            Về trang chủ
          </button>

          <button
            onClick={handleViewBookings}
            className="w-full bg-white text-green-600 text-lg font-bold py-4 rounded-full shadow-lg border-2 border-green-600 hover:bg-green-50 transition duration-300"
          >
            Xem lịch sử đặt hẹn
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
