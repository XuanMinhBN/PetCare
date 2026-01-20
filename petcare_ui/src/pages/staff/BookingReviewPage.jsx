import React, { useState, useEffect } from "react";
import { bookingAPI } from "../../services/api";

const BookingReviewPage = ({ onNavigate, onBack }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, CONFIRMED, COMPLETED, CANCELLED
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Load bookings from API
  useEffect(() => {
    loadBookings();
  }, []); // Chỉ load một lần khi component mount

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API đơn giản không có params
      const result = await bookingAPI.getAppointments();

      if (result.success) {
        // Transform API data to match our component structure
        const transformedBookings = result.data?.content || result.data || [];

        // Debug: Log để xem cấu trúc dữ liệu
        console.log("API Response:", result.data);
        console.log("Bookings:", transformedBookings);
        if (transformedBookings.length > 0) {
          console.log("First booking structure:", transformedBookings[0]);
        }

        setBookings(transformedBookings);
      } else {
        setError(result.error || "Không thể tải danh sách lịch hẹn");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on search term, status, and date
  const filteredBookings = bookings.filter((booking) => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const customerName = booking.user?.name || "";
      const petName = booking.pet?.name || "";
      const serviceName = booking.service?.name || "";

      const matchesSearch =
        customerName.toLowerCase().includes(searchLower) ||
        petName.toLowerCase().includes(searchLower) ||
        serviceName.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filter by status
    if (statusFilter !== "ALL" && booking.status !== statusFilter) {
      return false;
    }

    // Filter by date
    if (dateFilter && booking.timeSlot) {
      const bookingDate = new Date(booking.timeSlot)
        .toISOString()
        .split("T")[0];
      if (bookingDate !== dateFilter) {
        return false;
      }
    }

    return true;
  });

  const handleBookingClick = (bookingId) => {
    onNavigate && onNavigate("staff-booking-confirmation", { bookingId });
  };

  const handleApprove = async (bookingId, event) => {
    event.stopPropagation(); // Ngăn event bubbling để không trigger handleBookingClick
    try {
      const result = await bookingAPI.confirmAppointment(bookingId);
      if (result.success) {
        alert("Đã xác nhận lịch hẹn thành công!");
        loadBookings(); // Reload danh sách
      } else {
        alert(result.error || "Xác nhận lịch hẹn thất bại!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi xác nhận lịch hẹn!");
    }
  };

  const handleReject = async (bookingId, event) => {
    event.stopPropagation(); // Ngăn event bubbling để không trigger handleBookingClick
    try {
      const result = await bookingAPI.cancelAppointment(bookingId);
      if (result.success) {
        alert("Đã từ chối lịch hẹn thành công!");
        loadBookings(); // Reload danh sách
      } else {
        alert(result.error || "Từ chối lịch hẹn thất bại!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi từ chối lịch hẹn!");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
            onClick={loadBookings}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Thử lại
          </button>
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
            Duyệt lịch hẹn
          </h1>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên khách hàng, thú cưng, dịch vụ..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="COMPLETED">Đã hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày hẹn
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredBookings.length} / {bookings.length} lịch hẹn
            </p>
            <button
              onClick={loadBookings}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              🔄 Làm mới
            </button>
          </div>
        </div>

        {/* Grid layout cho thẻ vuông */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <p className="text-gray-600 text-lg">
                {searchTerm || statusFilter !== "ALL" || dateFilter
                  ? "Không tìm thấy lịch hẹn phù hợp"
                  : "Không có lịch hẹn nào cần duyệt"}
              </p>
              {(searchTerm || statusFilter !== "ALL" || dateFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setDateFilter("");
                  }}
                  className="mt-2 text-green-600 hover:text-green-700 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => handleBookingClick(booking.id)}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-green-300 transition-all duration-200 transform hover:-translate-y-1 group"
              >
                {/* Header với avatar và status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🐾</span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "CANCELED" ||
                          booking.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status === "PENDING"
                      ? "Chờ duyệt"
                      : booking.status === "CONFIRMED"
                      ? "Đã xác nhận"
                      : booking.status === "COMPLETED"
                      ? "Đã hoàn thành"
                      : booking.status === "CANCELED" ||
                        booking.status === "CANCELLED"
                      ? "Đã hủy"
                      : booking.status || "Chờ duyệt"}
                  </span>
                </div>

                {/* Nội dung chính */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    👤 {booking.user?.name || "N/A"}
                  </h3>

                  <p className="text-xs text-gray-600 truncate">
                    🐾 {booking.pet?.name || "N/A"}
                  </p>

                  <p
                    className="text-xs text-gray-600 truncate"
                    title={booking.service?.name}
                  >
                    🏥 {booking.service?.name || "N/A"}
                  </p>

                  <p className="text-xs text-gray-600">
                    📅{" "}
                    {booking.timeSlot
                      ? new Date(booking.timeSlot).toLocaleDateString("vi-VN") +
                        " " +
                        new Date(booking.timeSlot).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>

                  <p className="text-sm font-bold text-green-600">
                    💵 {formatCurrency(booking.price || 0)}
                  </p>
                </div>

                {/* Footer với nút action */}
                <div className="mt-3 flex justify-between items-center">
                  {/* Nút action - chỉ hiện với status PENDING */}
                  {booking.status === "PENDING" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleApprove(booking.id, e)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                      >
                        ✓ Duyệt
                      </button>
                      <button
                        onClick={(e) => handleReject(booking.id, e)}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        ✗ Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingReviewPage;
