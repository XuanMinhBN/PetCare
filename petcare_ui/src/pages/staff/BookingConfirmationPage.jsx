import React, { useState, useEffect } from "react";
import { bookingAPI } from "../../services/api";

const BookingConfirmationPage = ({ onNavigate, onBack, screenParams }) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (screenParams?.bookingId) {
      loadBooking();
    } else {
      setError("Không tìm thấy ID lịch hẹn");
      setLoading(false);
    }
  }, [screenParams]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await bookingAPI.getAppointmentById(
        screenParams.bookingId
      );

      if (result.success) {
        setBooking(result.data);
      } else {
        setError(result.error || "Không thể tải thông tin lịch hẹn");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải thông tin lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const dayName = days[date.getDay()];
    return `${dayName}, ${date.toLocaleDateString("vi-VN")}`;
  };

  const handleCancel = async () => {
    if (isProcessing || !booking?.id) return;

    try {
      setIsProcessing(true);
      const result = await bookingAPI.cancelAppointment(booking.id);

      if (result.success) {
        alert("Đã hủy lịch hẹn thành công!");
        onBack && onBack();
      } else {
        alert(result.error || "Hủy lịch hẹn thất bại!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi hủy lịch hẹn!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (isProcessing || !booking?.id) return;

    try {
      setIsProcessing(true);
      const result = await bookingAPI.confirmAppointment(booking.id);

      if (result.success) {
        alert("Đã xác nhận lịch hẹn thành công!");
        onBack && onBack();
      } else {
        alert(result.error || "Xác nhận lịch hẹn thất bại!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xác nhận lịch hẹn!");
    } finally {
      setIsProcessing(false);
    }
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

  if (error) {
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
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadBooking}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Không tìm thấy lịch hẹn</p>
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
            Xác nhận dịch vụ
          </h1>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>

        {/* Thông tin đặt lịch */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-4">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
            Thông tin đặt lịch
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày hẹn:</span>
              <span className="font-medium">
                {formatDate(booking.appointmentDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Khung giờ:</span>
              <span className="font-medium">{booking.timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thú cưng:</span>
              <span className="font-medium">{booking.petName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Giống loài:</span>
              <span className="font-medium">{booking.petBreed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dịch vụ:</span>
              <span className="font-medium">{booking.serviceName}</span>
            </div>
          </div>
        </div>

        {/* Tổng chi phí */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
            Tổng chi phí
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Dịch vụ:</span>
              <span className="font-medium">
                {formatCurrency(booking.serviceCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí đón thú:</span>
              <span className="font-medium">
                {formatCurrency(booking.pickupFee)}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(booking.totalCost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? "Đang xử lý..." : "Hủy"}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
