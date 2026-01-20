import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { profileAPI } from "../services/api";

function UserProfile({ onNavigate, onBack }) {
  const { state } = useApp();
  const [profile, setProfile] = useState(null);
  const [pets, setPets] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPetType, setSelectedPetType] = useState("ALL"); // "ALL", "DOG", "CAT"

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileResult, petsResult, addressesResult, notificationsResult] =
        await Promise.all([
          profileAPI.getProfile(),
          profileAPI.getPets(),
          profileAPI.getAddresses(),
          profileAPI.getNotifications(),
        ]);

      if (profileResult.success) {
        setProfile(profileResult.data);
      }
      if (petsResult.success) {
        setPets(petsResult.data?.content || petsResult.data || []);
      }
      if (addressesResult.success) {
        setAddresses(
          addressesResult.data?.content || addressesResult.data || []
        );
      }
      if (notificationsResult.success) {
        setNotifications(
          notificationsResult.data?.content || notificationsResult.data || []
        );
      }
    } catch (err) {
      setError("Không thể tải dữ liệu profile");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotificationAsSeen = async (notificationId) => {
    const result = await profileAPI.markNotificationAsSeen(notificationId);
    if (result.success) {
      loadProfileData(); // Reload để cập nhật trạng thái
    }
  };

  const handlePetTypeFilter = (type) => {
    setSelectedPetType(type);
  };

  const filteredPets = () => {
    if (selectedPetType === "ALL") {
      return pets || [];
    }
    return (pets || []).filter((pet) => pet.type === selectedPetType);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
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

          <div className="text-white font-bold text-xl">PETFIT</div>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-gray-100 p-6">
        <div className="flex items-center space-x-6 mb-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-green-600 flex items-center justify-center overflow-hidden">
              {profile?.avatar || state.user?.avatar ? (
                <img
                  src={profile?.avatar || state.user?.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center ${
                  profile?.avatar || state.user?.avatar ? "hidden" : "flex"
                }`}
              >
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {profile?.name || state.user?.name || "Người dùng"}
            </h1>
            <p className="text-gray-600 mb-2">
              {profile?.email || state.user?.email}
            </p>
            {profile?.phone && (
              <p className="text-gray-600 mb-4">{profile.phone}</p>
            )}

            {/* Stats */}
            <div className="flex space-x-6 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {(pets || []).length}
                </div>
                <div className="text-sm text-gray-600">thú cưng</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {(addresses || []).length}
                </div>
                <div className="text-sm text-gray-600">địa chỉ</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">
                  {(notifications || []).filter((n) => !n.seen).length}
                </div>
                <div className="text-sm text-gray-600">thông báo mới</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => onNavigate("edit-profile")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={() => onNavigate("packages")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Gói dịch vụ</span>
              </button>
              <button
                onClick={() => onNavigate("pet-selection")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Thú cưng</span>
              </button>
              <button
                onClick={() => onNavigate("booking-history")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
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
                <span>Lịch hẹn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Thú cưng Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Thú cưng của tôi
            </h2>
          </div>

          {/* Pet Type Filter Tabs */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => handlePetTypeFilter("ALL")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                selectedPetType === "ALL"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Tất cả ({(pets || []).length})
            </button>
            <button
              onClick={() => handlePetTypeFilter("DOG")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                selectedPetType === "DOG"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Chó ({(pets || []).filter((pet) => pet.type === "DOG").length})
            </button>
            <button
              onClick={() => handlePetTypeFilter("CAT")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                selectedPetType === "CAT"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Mèo ({(pets || []).filter((pet) => pet.type === "CAT").length})
            </button>
          </div>

          {filteredPets().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPets().map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-4h4v4H8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.breed} - {pet.type}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          onNavigate("pet-detail", { petId: pet.id })
                        }
                        className="text-blue-600 hover:text-blue-700"
                        title="Xem chi tiết"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          onNavigate("edit-pet-profile", { petId: pet.id })
                        }
                        className="text-green-600 hover:text-green-700"
                        title="Chỉnh sửa"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
              </svg>
              <p className="text-gray-600">
                {selectedPetType === "ALL"
                  ? "Chưa có thú cưng nào"
                  : selectedPetType === "DOG"
                  ? "Chưa có chó nào"
                  : "Chưa có mèo nào"}
              </p>
              {selectedPetType === "ALL" && (
                <button
                  onClick={() => onNavigate("add-pet")}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Thêm thú cưng đầu tiên
                </button>
              )}
            </div>
          )}
        </div>

        {/* Địa chỉ Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Địa chỉ của tôi
            </h2>
            <button
              onClick={() => onNavigate("add-address")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              + Thêm địa chỉ
            </button>
          </div>

          {(addresses || []).length > 0 ? (
            <div className="space-y-3">
              {(addresses || []).map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-lg shadow-sm p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {address.fullName}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {address.line1}, {address.ward}, {address.district},{" "}
                        {address.province}
                      </p>
                      <p className="text-gray-500 text-sm">{address.phone}</p>
                      {address.default && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        onNavigate("edit-address", { addressId: address.id })
                      }
                      className="text-green-600 hover:text-green-700 ml-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-600">Chưa có địa chỉ nào</p>
              <button
                onClick={() => onNavigate("add-address")}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          )}
        </div>

        {/* Thông báo Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông báo gần đây
          </h2>

          {(notifications || []).length > 0 ? (
            <div className="space-y-3">
              {(notifications || []).slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 ${
                    !notification.seen ? "border-l-4 border-green-500" : ""
                  }`}
                  onClick={() =>
                    !notification.seen &&
                    handleMarkNotificationAsSeen(notification.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(notification.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    {!notification.seen && (
                      <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                    )}
                  </div>
                </div>
              ))}
              {(notifications || []).length > 5 && (
                <button
                  onClick={() => onNavigate("notifications")}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  Xem tất cả thông báo
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-gray-600">Chưa có thông báo nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
