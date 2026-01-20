import { profileAPI } from "./api";

class NotificationService {
  constructor() {
    this.pollingInterval = null;
    this.pollingDelay = 30000; // 30 giây
    this.listeners = [];
    this.lastNotificationCount = 0;
    this.isPolling = false;
  }

  // Thêm listener để nhận thông báo mới
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  // Thông báo cho tất cả listeners
  notifyListeners(notifications) {
    this.listeners.forEach((listener) => {
      try {
        listener(notifications);
      } catch (error) {
        console.error("Error in notification listener:", error);
      }
    });
  }

  // Kiểm tra thông báo mới
  async checkForNewNotifications() {
    try {
      console.log("[NotificationService] checkForNewNotifications called");
      const result = await profileAPI.getNotifications();
      console.log(
        "[NotificationService] profileAPI.getNotifications result:",
        result
      );

      if (result.success && result.data) {
        const notifications = result.data;
        console.log("[NotificationService] notifications data:", notifications);
        console.log(
          "[NotificationService] notifications type:",
          typeof notifications
        );
        console.log(
          "[NotificationService] notifications isArray:",
          Array.isArray(notifications)
        );

        // Đảm bảo notifications là một array
        const notificationsArray = Array.isArray(notifications)
          ? notifications
          : [];
        console.log(
          "[NotificationService] notificationsArray:",
          notificationsArray
        );

        const unseenCount = notificationsArray.filter((n) => !n.seen).length;
        console.log("[NotificationService] unseenCount:", unseenCount);

        // Nếu có thông báo mới (số lượng chưa đọc tăng lên)
        if (
          unseenCount > this.lastNotificationCount &&
          this.lastNotificationCount > 0
        ) {
          const newNotifications = notificationsArray.filter(
            (n) =>
              !n.seen &&
              new Date(n.createdAt) > new Date(Date.now() - this.pollingDelay)
          );

          if (newNotifications.length > 0) {
            // Hiển thị browser notification
            this.showBrowserNotification(newNotifications[0]);
          }
        }

        this.lastNotificationCount = unseenCount;
        this.notifyListeners(notificationsArray);

        console.log("[NotificationService] Returning success with data:", {
          notifications: notificationsArray,
          unseenCount,
        });
        return { success: true, data: notificationsArray, unseenCount };
      }

      console.log("[NotificationService] API call failed:", result.error);
      return { success: false, error: result.error };
    } catch (error) {
      console.error("Error checking notifications:", error);
      return { success: false, error: "Failed to check notifications" };
    }
  }

  // Hiển thị browser notification
  showBrowserNotification(notification) {
    // Kiểm tra quyền hiển thị notification
    if (Notification.permission === "granted") {
      const notificationObj = new Notification(
        notification.title || "Thông báo mới",
        {
          body: notification.message || "Bạn có thông báo mới từ PetCare",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: `notification-${notification.id}`,
          requireInteraction: false,
          silent: false,
        }
      );

      // Đóng notification sau 5 giây
      setTimeout(() => {
        notificationObj.close();
      }, 5000);

      // Xử lý khi click vào notification
      notificationObj.onclick = () => {
        window.focus();
        // Có thể thêm logic để điều hướng đến trang thông báo
        if (window.location.pathname !== "/notifications") {
          window.location.href = "/notifications";
        }
        notificationObj.close();
      };
    } else if (Notification.permission !== "denied") {
      // Yêu cầu quyền hiển thị notification
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          this.showBrowserNotification(notification);
        }
      });
    }
  }

  // Bắt đầu polling để kiểm tra thông báo mới
  startPolling() {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    console.log("Starting notification polling...");

    // Kiểm tra ngay lập tức
    this.checkForNewNotifications();

    // Thiết lập polling định kỳ
    this.pollingInterval = setInterval(() => {
      this.checkForNewNotifications();
    }, this.pollingDelay);
  }

  // Dừng polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log("Stopped notification polling");
  }

  // Thiết lập delay cho polling
  setPollingDelay(delay) {
    this.pollingDelay = delay;

    // Nếu đang polling, restart với delay mới
    if (this.isPolling) {
      this.stopPolling();
      this.startPolling();
    }
  }

  // Lấy thông tin polling
  getPollingInfo() {
    return {
      isPolling: this.isPolling,
      delay: this.pollingDelay,
      lastCount: this.lastNotificationCount,
    };
  }

  // Reset service
  reset() {
    this.stopPolling();
    this.listeners = [];
    this.lastNotificationCount = 0;
  }
}

// Tạo singleton instance
const notificationService = new NotificationService();

export default notificationService;
