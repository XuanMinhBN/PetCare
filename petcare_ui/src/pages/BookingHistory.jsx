import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { bookingAPI } from "../services/api";

function BookingHistory({ onNavigate, onBack }) {
  const { state } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, completed, cancelled

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await bookingAPI.getAppointments(1, 50); // Lấy tối đa 50 appointments

      if (result.success) {
        const appointmentsData = result.data?.content || result.data || [];
        setAppointments(appointmentsData);
      } else {
        setError(result.error || "Không thể tải danh sách lịch đặt");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch này?")) {
      return;
    }

    try {
      setLoading(true);
      const result = await bookingAPI.cancelAppointment(appointmentId);

      if (result.success) {
        // Cập nhật danh sách appointments
        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === appointmentId ? { ...apt, status: "CANCELLED" } : apt
          )
        );
        alert("Hủy lịch thành công");
      } else {
        alert(result.error || "Không thể hủy lịch");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi hủy lịch");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("vi-VN");
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 gap-4 h-full">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-800 rounded-full"></div>
                    <div className="w-2 h-2 bg-emerald-800 rounded-full ml-1"></div>
                    <div className="w-2 h-2 bg-emerald-800 rounded-full ml-1"></div>
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

        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-emerald-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-800 rounded-full ml-1"></div>
                  <div className="w-2 h-2 bg-emerald-800 rounded-full ml-1"></div>
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

          <button
            onClick={() => onNavigate("booking")}
            className="bg-white text-emerald-600 rounded-lg px-3 py-2 shadow-lg font-semibold"
          >
            Đặt lịch
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Lịch sử đặt hẹn
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các lịch hẹn của bạn
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Tất cả", count: appointments.length },
              {
                key: "PENDING",
                label: "Chờ xác nhận",
                count: appointments.filter((apt) => apt.status === "PENDING")
                  .length,
              },
              {
                key: "CONFIRMED",
                label: "Đã xác nhận",
                count: appointments.filter((apt) => apt.status === "CONFIRMED")
                  .length,
              },
              {
                key: "COMPLETED",
                label: "Hoàn thành",
                count: appointments.filter((apt) => apt.status === "COMPLETED")
                  .length,
              },
              {
                key: "CANCELLED",
                label: "Đã hủy",
                count: appointments.filter((apt) => apt.status === "CANCELLED")
                  .length,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {filter === "all" ? "Chưa có lịch hẹn nào" : "Không có lịch hẹn"}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === "all"
                ? "Bạn chưa đặt lịch hẹn nào. Hãy đặt lịch để chăm sóc thú cưng của bạn!"
                : "Không có lịch hẹn nào với trạng thái này."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => onNavigate("booking")}
                className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
              >
                Đặt lịch ngay
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      #{appointment.id}
                    </h3>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusText(appointment.status)}
                    </div>
                  </div>

                  {appointment.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Hủy lịch
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Thú cưng</p>
                        <p className="font-semibold text-gray-800">
                          {appointment.pet?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-blue-600"
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
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Dịch vụ</p>
                        <p className="font-semibold text-gray-800">
                          {appointment.service?.name || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Thời gian</p>
                        <p className="font-semibold text-gray-800">
                          {formatDateTime(appointment.timeSlot)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Giá</p>
                        <p className="font-semibold text-emerald-600">
                          {appointment.price?.toLocaleString("vi-VN") || "N/A"}{" "}
                          VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {appointment.address && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Địa chỉ</p>
                        <p className="font-medium text-gray-800">
                          {appointment.address.line1},{" "}
                          {appointment.address.ward},{" "}
                          {appointment.address.district},{" "}
                          {appointment.address.province}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                        <p className="text-gray-800">{appointment.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;
