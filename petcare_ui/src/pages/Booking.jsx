import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { bookingAPI, profileAPI } from "../services/api";

function Booking({ onNavigate, onBack, selectedService }) {
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(
    selectedService?.id || ""
  );
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  // Data states
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [petsResult, servicesResult, addressesResult] = await Promise.all([
        profileAPI.getPets(),
        bookingAPI.getBookingServices(),
        profileAPI.getAddresses(),
      ]);

      if (petsResult.success) {
        setPets(petsResult.data?.content || petsResult.data || []);
      }
      if (servicesResult.success) {
        const servicesData =
          servicesResult.data?.content || servicesResult.data || [];
        setServices(servicesData);

        // Nếu không có selectedService (từ trang Home), tự động chọn dịch vụ CONSULT (khám và chăm sóc cơ bản)
        if (!selectedService) {
          const basicHealthService = servicesData.find(
            (service) => service.type === "CONSULT"
          );
          if (basicHealthService) {
            setSelectedServiceId(basicHealthService.id);
          }
        }
      }
      if (addressesResult.success) {
        setAddresses(
          addressesResult.data?.content || addressesResult.data || []
        );
      }
    } catch (err) {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!state.isAuthenticated) {
      alert("Vui lòng đăng nhập để đặt lịch");
      return;
    }

    // Validation
    if (!selectedPetId) {
      setError("Vui lòng chọn thú cưng");
      return;
    }
    if (!selectedServiceId) {
      setError("Vui lòng chọn dịch vụ");
      return;
    }
    if (!selectedAddressId) {
      setError("Vui lòng chọn địa chỉ");
      return;
    }
    if (!timeSlot) {
      setError("Vui lòng chọn thời gian");
      return;
    }

    try {
      // TẠO ĐỐI TƯỢNG PAYLOAD KHỚP VỚI DTO BẠN CUNG CẤP
      const appointmentDataToSend = {
        timeSlot: new Date(timeSlot).toISOString(),
        status: "PENDING", // Gán trạng thái ban đầu
        createdAt: new Date().toISOString(), // Gán thời gian tạo ở frontend
        petId: parseInt(selectedPetId, 10),
        serviceId: parseInt(selectedServiceId, 10),
        addressId: parseInt(selectedAddressId, 10),
      };

      // Gọi API với đối tượng data mới
      const result = await bookingAPI.createAppointment(appointmentDataToSend);

      if (result.success) {
        onNavigate("booking-confirmation", { appointmentData: result.data });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Không thể đặt lịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
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
          Đặt lịch chăm sóc
        </h1>
        <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && (
          <>
            {/* Chọn thú cưng */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Chọn thú cưng
              </h2>
              <div className="relative">
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="block w-full bg-white border border-gray-300 py-3 px-4 pr-8 rounded-lg shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Chọn thú cưng của bạn</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.type === "DOG" ? "Chó" : "Mèo"} -{" "}
                      {pet.breed})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Chọn dịch vụ */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Chọn dịch vụ
              </h2>

              {/* Hiển thị dịch vụ đã chọn từ trang Services */}
              {selectedService && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-800">
                        {selectedService.name}
                      </h3>
                      <p className="text-sm text-green-600">
                        {selectedService.description}
                      </p>
                      <p className="text-sm font-medium text-green-700">
                        {selectedService.basePrice?.toLocaleString("vi-VN")} VNĐ
                      </p>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Hiển thị dịch vụ cơ bản cố định từ trang Home */}
              {!selectedService && selectedServiceId && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800">
                        Khám và chăm sóc sức khỏe cơ bản
                      </h3>
                      <p className="text-sm text-blue-600">
                        Dịch vụ khám và tư vấn sức khỏe cơ bản cho thú cưng
                      </p>
                      <p className="text-sm font-medium text-blue-700">
                        Dịch vụ cố định - Không thể thay đổi
                      </p>
                    </div>
                    <div className="text-blue-600">
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Chỉ hiển thị dropdown khi có selectedService (từ trang Services) */}
              {selectedService && (
                <div className="relative">
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="block w-full bg-white border border-gray-300 py-3 px-4 pr-8 rounded-lg shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Thay đổi dịch vụ khác</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} -{" "}
                        {service.basePrice?.toLocaleString("vi-VN")} VNĐ
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Chọn địa chỉ */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Chọn địa chỉ
              </h2>
              <div className="relative">
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="block w-full bg-white border border-gray-300 py-3 px-4 pr-8 rounded-lg shadow-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Chọn địa chỉ nhận dịch vụ</option>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.fullName} - {address.line1}, {address.ward},{" "}
                      {address.district}, {address.province}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Thời gian */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Thời gian
              </h2>
              <input
                type="datetime-local"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </>
        )}

        {/* Đặt ngay button */}
        <button
          onClick={handleBook}
          disabled={loading}
          className={`w-full text-white text-2xl font-bold py-4 rounded-full shadow-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Đang xử lý..." : "Đặt ngay"}
        </button>

        {/* Thông báo khi chưa có dữ liệu */}
        {!loading && pets.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Bạn chưa có thú cưng nào. Hãy thêm thú cưng trước khi đặt lịch.
            </p>
            <button
              onClick={() => onNavigate("add-pet")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Thêm thú cưng
            </button>
          </div>
        )}

        {!loading && addresses.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ trước khi đặt lịch.
            </p>
            <button
              onClick={() => onNavigate("add-address")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Thêm địa chỉ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Booking;
