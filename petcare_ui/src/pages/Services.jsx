import React, { useState, useEffect } from "react";
import { servicesAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import Pagination from "../components/Pagination";

function Services({ onNavigate, onBack }) {
  const { state, actions } = useApp();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 2x3 or 3x2 grid

  // Load services from API
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await servicesAPI.getServices();

      if (result.success) {
        let servicesData = [];
        // KIỂM TRA XEM DATA LÀ MẢNG TRỰC TIẾP
        if (Array.isArray(result.data)) {
          servicesData = result.data;
        }
        // HAY LÀ CẤU TRÚC PAGE CÓ CONTENT
        else if (result.data && Array.isArray(result.data.content)) {
          servicesData = result.data.content;
        }
        // NẾU KHÔNG THÌ COI NHƯ LÀ LỖI DỮ LIỆU
        else {
          throw new Error("Dữ liệu dịch vụ trả về không hợp lệ.");
        }

        setServices(servicesData);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách dịch vụ");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    if (!state.isAuthenticated) {
      alert("Vui lòng đăng nhập để đặt lịch dịch vụ");
      return;
    }

    // Chuyển đến trang đặt lịch với dịch vụ đã chọn
    onNavigate("booking", { selectedService: service });
  };

  // Filter services based on search term and type
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || service.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Reset to first page when filtering changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  // Get unique service types for filter
  const serviceTypes = [
    "ALL",
    ...new Set(services.map((service) => service.type)),
  ];

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
      <div className="bg-gray-100 p-6">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Dịch Vụ</h1>
          <div className="w-20 h-1 bg-green-600 mx-auto rounded"></div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                {type === "ALL" ? "Tất cả" : type}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-8">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mt-2 text-gray-600">
                Đang tải danh sách dịch vụ...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-8 rounded-lg">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Lỗi tải dữ liệu
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="bg-white p-4 rounded mt-4 text-left">
                  <h4 className="font-semibold mb-2">Debug Info:</h4>
                  <p className="text-sm text-gray-600">
                    Services length: {services.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    Loading: {loading ? "true" : "false"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Error: {error || "none"}
                  </p>
                </div>
                <button
                  onClick={loadServices}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors mt-4"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 border border-gray-400 text-gray-700 px-6 py-8 rounded-lg">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Chưa có dịch vụ nào
                </h3>
                <p className="text-gray-600 mb-4">
                  Hiện tại chưa có dịch vụ nào được cung cấp
                </p>
                <button
                  onClick={loadServices}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tải lại
                </button>
              </div>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="text-center text-gray-600">
                {
                  filteredServices.filter(
                    (service) => service.status === "ACTIVE"
                  ).length
                }{" "}
                dịch vụ
                {searchTerm && ` cho "${searchTerm}"`}
                {selectedType !== "ALL" && ` loại ${selectedType}`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices
                  .filter((service) => service.status === "ACTIVE")
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div
                          className={`w-12 h-12 ${
                            service.type === "EMERGENCY"
                              ? "bg-red-100"
                              : service.type === "SUBSCRIPTION"
                              ? "bg-yellow-100"
                              : service.type === "TRACK"
                              ? "bg-blue-100"
                              : service.type === "CONSULT"
                              ? "bg-orange-100"
                              : service.type === "GROOMING"
                              ? "bg-purple-100"
                              : service.type === "VACCINATION"
                              ? "bg-indigo-100"
                              : service.type === "TRAINING"
                              ? "bg-pink-100"
                              : "bg-gray-100"
                          } rounded-full flex items-center justify-center`}
                        >
                          <svg
                            className={`w-6 h-6 ${
                              service.type === "EMERGENCY"
                                ? "text-red-600"
                                : service.type === "SUBSCRIPTION"
                                ? "text-yellow-600"
                                : service.type === "TRACK"
                                ? "text-blue-600"
                                : service.type === "CONSULT"
                                ? "text-orange-600"
                                : service.type === "GROOMING"
                                ? "text-purple-600"
                                : service.type === "VACCINATION"
                                ? "text-indigo-600"
                                : service.type === "TRAINING"
                                ? "text-pink-600"
                                : "text-gray-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            {service.type === "EMERGENCY" ? (
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            ) : service.type === "SUBSCRIPTION" ? (
                              <>
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path
                                  fillRule="evenodd"
                                  d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z"
                                  clipRule="evenodd"
                                />
                              </>
                            ) : service.type === "TRACK" ? (
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            ) : service.type === "CONSULT" ? (
                              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" />
                            ) : service.type === "GROOMING" ? (
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : service.type === "VACCINATION" ? (
                              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            ) : service.type === "TRAINING" ? (
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {service.name}
                        </h3>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          {service.basePrice.toLocaleString()}đ
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.type === "EMERGENCY"
                              ? "bg-red-100 text-red-800"
                              : service.type === "SUBSCRIPTION"
                              ? "bg-yellow-100 text-yellow-800"
                              : service.type === "TRACK"
                              ? "bg-blue-100 text-blue-800"
                              : service.type === "CONSULT"
                              ? "bg-orange-100 text-orange-800"
                              : service.type === "GROOMING"
                              ? "bg-purple-100 text-purple-800"
                              : service.type === "VACCINATION"
                              ? "bg-indigo-100 text-indigo-800"
                              : service.type === "TRAINING"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {service.type}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBookService(service)}
                        className={`w-full ${
                          service.type === "EMERGENCY"
                            ? "bg-red-600 hover:bg-red-700"
                            : service.type === "SUBSCRIPTION"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : service.type === "TRACK"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : service.type === "CONSULT"
                            ? "bg-orange-600 hover:bg-orange-700"
                            : service.type === "GROOMING"
                            ? "bg-purple-600 hover:bg-purple-700"
                            : service.type === "VACCINATION"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : service.type === "TRAINING"
                            ? "bg-pink-600 hover:bg-pink-700"
                            : "bg-gray-600 hover:bg-gray-700"
                        } text-white py-3 rounded-lg font-medium transition-colors`}
                      >
                        {service.type === "EMERGENCY"
                          ? `Gọi cấp cứu`
                          : service.type === "SUBSCRIPTION"
                          ? `Đăng ký dịch vụ`
                          : `Đặt lịch ngay`}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  filteredServices.filter(
                    (service) => service.status === "ACTIVE"
                  ).length / itemsPerPage
                )}
                onPageChange={setCurrentPage}
                totalItems={
                  filteredServices.filter(
                    (service) => service.status === "ACTIVE"
                  ).length
                }
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}

          {/* No search results */}
          {!loading &&
            !error &&
            services.length > 0 &&
            filteredServices.filter((service) => service.status === "ACTIVE")
              .length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Không tìm thấy dịch vụ
                </h3>
                <p className="text-gray-500">
                  Không có dịch vụ nào phù hợp với tìm kiếm của bạn
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("ALL");
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Services;
