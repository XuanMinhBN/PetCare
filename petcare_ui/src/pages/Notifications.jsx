import React, { useState, useEffect } from "react";
import { profileAPI } from "../services/api";
import { useApp } from "../context/AppContext";

function Notifications({ onNavigate, onBack }) {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const { notifications, unreadNotificationCount } = state;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading notifications...");
      console.log("Current state notifications:", notifications);
      console.log(
        "Current state unreadNotificationCount:",
        unreadNotificationCount
      );

      // Sử dụng action từ AppContext
      const result = await actions.refreshNotifications();

      console.log("refreshNotifications result:", result);

      if (!result.success) {
        console.error("Failed to load notifications:", result.error);

        // Fallback: Tạo mock data để test UI
        const mockNotifications = [
          {
            id: 1,
            title: "Thông báo mới",
            message: "Đây là thông báo mẫu để test giao diện",
            seen: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Đặt lịch thành công",
            message: "Lịch chăm sóc thú cưng của bạn đã được xác nhận",
            seen: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];

        console.log("Using mock notifications for testing:", mockNotifications);

        // Cập nhật state với mock data
        actions.markAllNotificationsAsSeen(); // Reset first
        // Note: We need to manually set notifications in state
        // For now, just show the mock data in error message

        setError(
          `Không thể kết nối đến server (${result.error}). Đang hiển thị dữ liệu mẫu.`
        );
      } else {
        console.log("Notifications loaded successfully:", result.data);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Có lỗi xảy ra khi tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      setRefreshing(true);
      await actions.refreshNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsSeen = async (notificationId) => {
    try {
      // Gọi API PATCH /api/profile/notifications/{id}/seen
      const result = await profileAPI.markNotificationAsSeen(notificationId);

      if (result.success) {
        // Cập nhật state trong AppContext
        actions.markNotificationAsSeen(notificationId);

        // Hiển thị thông báo thành công
        setSuccessMessage("Đã đánh dấu thông báo là đã đọc");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Failed to mark notification as seen:", result.error);
        setError(result.error || "Không thể đánh dấu thông báo");
      }
    } catch (err) {
      console.error("Lỗi khi đánh dấu thông báo:", err);
      setError("Có lỗi xảy ra khi đánh dấu thông báo");
    }
  };

  const handleMarkAllAsSeen = async () => {
    const unseenNotifications = (notifications || []).filter((n) => !n.seen);

    if (unseenNotifications.length === 0) {
      return;
    }

    try {
      // Gọi API cho tất cả thông báo chưa đọc
      const promises = unseenNotifications.map((notif) =>
        profileAPI.markNotificationAsSeen(notif.id)
      );

      const results = await Promise.allSettled(promises);

      // Kiểm tra kết quả và cập nhật trạng thái
      const successCount = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;

      if (successCount > 0) {
        // Cập nhật state trong AppContext
        actions.markAllNotificationsAsSeen();

        // Hiển thị thông báo thành công
        setSuccessMessage(`Đã đánh dấu ${successCount} thông báo là đã đọc`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }

      if (successCount < unseenNotifications.length) {
        console.warn(
          `Chỉ đánh dấu được ${successCount}/${unseenNotifications.length} thông báo`
        );
        setError(
          `Chỉ đánh dấu được ${successCount}/${unseenNotifications.length} thông báo`
        );
      }
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả thông báo:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông báo...</p>
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

          <div className="text-white font-bold text-xl">Thông báo</div>

          <div className="flex items-center space-x-2">
            <button
              onClick={refreshNotifications}
              disabled={refreshing}
              className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-30 disabled:opacity-50"
            >
              {refreshing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tải...
                </div>
              ) : (
                "Làm mới"
              )}
            </button>
            {unreadNotificationCount > 0 && (
              <button
                onClick={handleMarkAllAsSeen}
                className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-30"
              >
                Đọc tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <button
                onClick={async () => {
                  console.log("Testing API directly...");
                  try {
                    const result = await profileAPI.getNotifications();
                    console.log("Direct API test result:", result);
                    alert(
                      `API Test Result: ${JSON.stringify(result, null, 2)}`
                    );
                  } catch (err) {
                    console.error("Direct API test error:", err);
                    alert(`API Test Error: ${err.message}`);
                  }
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Test API Direct
              </button>
              <button
                onClick={loadNotifications}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 ml-2"
              >
                Retry
              </button>
              <button
                onClick={() => {
                  const token = localStorage.getItem("authToken");
                  console.log("Auth token:", token ? "Present" : "Missing");
                  console.log("User state:", state.user);
                  console.log("Is authenticated:", state.isAuthenticated);
                  alert(
                    `Auth Status:\nToken: ${
                      token ? "Present" : "Missing"
                    }\nUser: ${
                      state.user ? "Logged in" : "Not logged in"
                    }\nAuthenticated: ${state.isAuthenticated}`
                  );
                }}
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 ml-2"
              >
                Check Auth
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {(notifications || []).length}
              </div>
              <div className="text-sm text-gray-600">Tổng thông báo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {unreadNotificationCount}
              </div>
              <div className="text-sm text-gray-600">Chưa đọc</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {(notifications || []).length - unreadNotificationCount}
              </div>
              <div className="text-sm text-gray-600">Đã đọc</div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {(notifications || []).length > 0 || error ? (
          <div className="space-y-4">
            {/* Show mock data when there's an error */}
            {error && (notifications || []).length === 0 ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-800">
                          Thông báo mới
                        </h3>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Đây là thông báo mẫu để test giao diện
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date().toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <button className="ml-2 text-green-600 hover:text-green-700 text-sm">
                      Đánh dấu đã đọc
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-800">
                          Đặt lịch thành công
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Lịch chăm sóc thú cưng của bạn đã được xác nhận
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(Date.now() - 86400000).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              (notifications || []).map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.seen ? "border-l-4 border-green-500" : ""
                  }`}
                  onClick={() =>
                    !notification.seen && handleMarkAsSeen(notification.id)
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-800">
                          {notification.title}
                        </h3>
                        {!notification.seen && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(notification.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    {!notification.seen && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsSeen(notification.id);
                        }}
                        className="ml-2 text-green-600 hover:text-green-700 text-sm"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Chưa có thông báo nào
            </h3>
            <p className="text-gray-600">Các thông báo mới sẽ hiển thị ở đây</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
