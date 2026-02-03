import axios from "axios";
import { API_CONFIG } from "../config/api";
import { jwtDecode } from "jwt-decode";

// Tạo axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Tạo axios instance riêng cho Google OAuth (không cần auth header)
const apiPublic = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Interceptor để thêm token vào headers một cách tự động
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor để xử lý lỗi 401 (Unauthorized) một cách tập trung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ. Đăng xuất người dùng.");
      localStorage.removeItem("authToken");
      // Chuyển hướng về trang đăng nhập, trừ khi đang ở môi trường development
      if (process.env.NODE_ENV !== "development") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// API Services
export const authAPI = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      const { id_token } = response.data;

      if (!id_token) {
        return { success: false, error: "Không nhận được token từ server." };
      }

      const decodedUser = jwtDecode(id_token);
      console.log("[authAPI.login] Decoded User from Token:", decodedUser); // Chỉ lưu token. AppContext sẽ quản lý state user.

      localStorage.setItem("authToken", id_token);

      // THAY ĐỔI QUAN TRỌNG:
      // Trả về dữ liệu với cấu trúc phẳng, đúng như AppContext mới mong đợi.
      // Không còn lồng trong thuộc tính `data`.
      return {
        success: true,
        user: decodedUser,
        token: id_token,
      };
    } catch (error) {
      // Xử lý lỗi một cách nhất quán, không dùng mock data ở đây nữa
      const errorMessage =
        error.response?.data?.message || "Thông tin đăng nhập không chính xác.";
      console.error("[authAPI.login] Login Failed:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }, // Đăng ký

  register: async (userData) => {
    try {
      const registerData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: userData.role || "ROLE_CUSTOMER",
        tier: userData.tier || "FREE",
        avatar: userData.avatar || "",
        activated: userData.activated !== undefined ? userData.activated : true,
      };
      const response = await api.post("/register", registerData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đăng ký thất bại",
      };
    }
  }, // Đăng xuất - chỉ cần xóa token

  logout: () => {
    localStorage.removeItem("authToken");
  },

  // Yêu cầu đặt lại mật khẩu
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post("/reset-password/init", { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Không thể gửi yêu cầu đặt lại mật khẩu",
      };
    }
  },

  // Hoàn tất đặt lại mật khẩu
  finishPasswordReset: async ({ key, newPassword }) => {
    try {
      const response = await api.post("/reset-password/finish", {
        key,
        newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Không thể đặt lại mật khẩu. Vui lòng kiểm tra mã đặt lại.",
      };
    }
  },

  // Đăng nhập bằng Google (credential từ Google Identity Services)
  loginWithGoogle: async ({ credential }) => {
    try {
      // Sử dụng apiPublic để tránh thêm Authorization header (endpoint này là public)
      // Gửi credential với key "token" như backend mong đợi
      const response = await apiPublic.post("/google", { token: credential });
      const { token } = response.data;

      if (!token) {
        return { success: false, error: "Không nhận được token từ server." };
      }

      const decodedUser = jwtDecode(token);
      localStorage.setItem("authToken", token);
      return { success: true, user: decodedUser, token };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập Google thất bại.";
      console.error("[authAPI.loginWithGoogle] Error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Các hàm này không còn cần thiết khi AppContext quản lý state
  // nhưng giữ lại để tránh lỗi nếu có nơi khác đang gọi
  getCurrentUser: () => null,
  isAuthenticated: () => !!localStorage.getItem("authToken"),
};
export const storeAPI = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      const response = await api.get("/catalog/products");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách sản phẩm thất bại",
      };
    }
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/catalog/products/${productId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy chi tiết sản phẩm thất bại",
      };
    }
  },
};

// API cho chức năng checkout - cart operations
export const checkoutAPI = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (cartItemData) => {
    try {
      const response = await api.post("/checkout/cart/items", cartItemData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Thêm vào giỏ hàng thất bại",
      };
    }
  },

  // Lấy giỏ hàng hiện tại
  getCart: async () => {
    try {
      const response = await api.get("/checkout/cart");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lấy giỏ hàng thất bại",
      };
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (itemId, updateData) => {
    try {
      const response = await api.patch(
        `/checkout/cart/items/${itemId}`,
        updateData,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Cập nhật giỏ hàng thất bại",
      };
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/checkout/cart/items/${itemId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Xóa sản phẩm khỏi giỏ hàng thất bại",
      };
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/checkout/orders", orderData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Tạo đơn hàng thất bại",
      };
    }
  },

  // Lấy danh sách đơn hàng (của user đăng nhập)
  getOrders: async () => {
    try {
      const response = await api.get("/checkout/orders");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách đơn hàng thất bại",
      };
    }
  },

  // Lấy tất cả đơn hàng (cho staff/admin)
  getAllOrders: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page != null) queryParams.append("page", params.page);
      if (params.size != null) queryParams.append("size", params.size);
      if (params.status) queryParams.append("status", params.status);
      if (params.sort) queryParams.append("sort", params.sort);
      const queryString = queryParams.toString();
      const url = `/checkout/all-orders${queryString ? `?${queryString}` : ""}`;
      const response = await api.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách đơn hàng thất bại",
      };
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/checkout/orders/${orderId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy chi tiết đơn hàng thất bại",
      };
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const response = await api.post(`/checkout/orders/${orderId}/cancel`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Hủy đơn hàng thất bại",
      };
    }
  },

  // Xác nhận đơn hàng (cho staff)
  confirmOrder: async (orderId) => {
    try {
      const response = await api.patch(`/checkout/orders/${orderId}/confirm`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Xác nhận đơn hàng thất bại",
      };
    }
  },

  // Áp dụng coupon cho đơn hàng
  applyCoupon: async (orderId, couponCode) => {
    try {
      const response = await api.post(
        `/checkout/order/${orderId}/apply-coupon`,
        {
          couponCode: couponCode,
        },
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Áp dụng coupon thất bại",
      };
    }
  },
};

// API cho chức năng thanh toán
export const paymentAPI = {
  // Tạo link thanh toán PayOS
  createPaymentLink: async (orderData) => {
    try {
      const response = await api.post(
        "/payments/create-payment-link",
        orderData,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Không thể tạo link thanh toán",
      };
    }
  },
};

export const servicesAPI = {
  // Lấy danh sách dịch vụ
  getServices: async () => {
    try {
      const response = await api.get("/catalog/services");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Không thể tải danh sách dịch vụ",
      };
    }
  },

  // Lấy chi tiết dịch vụ
  getServiceById: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lấy chi tiết dịch vụ thất bại",
      };
    }
  },

  // Đặt lịch dịch vụ
  bookService: async (serviceData) => {
    try {
      const response = await api.post("/services/book", serviceData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đặt lịch dịch vụ thất bại",
      };
    }
  },

  // Lấy lịch sử đặt dịch vụ
  getServiceHistory: async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await api.get(`/services/history?${params}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lấy lịch sử dịch vụ thất bại",
      };
    }
  },

  // Hủy đặt lịch dịch vụ
  cancelService: async (bookingId) => {
    try {
      const response = await api.patch(`/services/cancel/${bookingId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Hủy đặt lịch thất bại",
      };
    }
  },
};

export const petAPI = {
  // Lấy danh sách thú cưng của user
  getPets: async () => {
    try {
      const response = await api.get("/pets");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách thú cưng thất bại",
      };
    }
  },

  // Tạo profile thú cưng mới
  createPet: async (petData) => {
    try {
      const response = await api.post("/pets", petData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Tạo profile thú cưng thất bại",
      };
    }
  },

  // Cập nhật profile thú cưng
  updatePet: async (petId, petData) => {
    try {
      const response = await api.patch(`/pets/${petId}`, petData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Cập nhật profile thú cưng thất bại",
      };
    }
  },

  // Xóa thú cưng
  deletePet: async (petId) => {
    try {
      const response = await api.delete(`/pets/${petId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Xóa thú cưng thất bại",
      };
    }
  },
};

export const adminAPI = {
  // Thay đổi role của user
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Thay đổi role thất bại",
      };
    }
  },

  // Lấy danh sách users
  getUsers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.size) queryParams.append("size", params.size);
      if (params.search) queryParams.append("search", params.search);
      if (params.role) queryParams.append("role", params.role);

      const queryString = queryParams.toString();
      const url = `/admin/users${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lấy danh sách users thất bại",
      };
    }
  },

  // Khóa/mở khóa tài khoản user
  toggleUserStatus: async (userId, activated) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        activated,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Thay đổi trạng thái tài khoản thất bại",
      };
    }
  },
};

export const bookingAPI = {
  // Lấy danh sách cuộc hẹn cho Staff duyệt
  getAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Thêm các tham số query nếu có
      if (params.status) queryParams.append("status", params.status);
      if (params.date) queryParams.append("date", params.date);
      if (params.page) queryParams.append("page", params.page);
      if (params.size) queryParams.append("size", params.size);
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.customerName)
        queryParams.append("customerName", params.customerName);
      if (params.serviceName)
        queryParams.append("serviceName", params.serviceName);

      const queryString = queryParams.toString();
      const url = `/booking/users/appointments${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await api.get(url);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách cuộc hẹn thất bại",
      };
    }
  },

  // Lấy danh sách cuộc hẹn cho Staff (với tham số mặc định)
  getAppointmentsForStaff: async () => {
    try {
      const params = {
        page: 0,
        size: 100, // Load more appointments for staff
        sort: "appointmentDate,asc",
        status: "PENDING,CONFIRMED", // Only show pending and confirmed appointments
      };

      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page);
      queryParams.append("size", params.size);
      queryParams.append("sort", params.sort);
      queryParams.append("status", params.status);

      const url = `/booking/users/appointments?${queryParams.toString()}`;
      const response = await api.get(url);

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Lấy danh sách cuộc hẹn cho Staff thất bại",
      };
    }
  },

  // Lấy thông tin cuộc hẹn theo ID
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await api.get(`/booking/appointments/${appointmentId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy thông tin cuộc hẹn thất bại",
      };
    }
  },

  // Tạo cuộc hẹn mới
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post("/booking/appointments", appointmentData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đặt lịch thất bại",
      };
    }
  },

  // Hoàn thành cuộc hẹn
  completeAppointment: async (appointmentId) => {
    try {
      const response = await api.post(
        `/booking/appointments/${appointmentId}/complete`,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Hoàn thành cuộc hẹn thất bại",
      };
    }
  },

  // Hủy cuộc hẹn
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await api.post(
        `/booking/appointments/${appointmentId}/cancel`,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Hủy cuộc hẹn thất bại",
      };
    }
  },

  // Xác nhận cuộc hẹn
  confirmAppointment: async (appointmentId) => {
    try {
      const response = await api.patch(
        `/booking/appointments/${appointmentId}/confirm`,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Xác nhận cuộc hẹn thất bại",
      };
    }
  },

  // Lấy danh sách dịch vụ cho booking
  getBookingServices: async () => {
    try {
      const response = await api.get("/booking/services");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách dịch vụ thất bại",
      };
    }
  },
};

export const profileAPI = {
  // Lấy thông tin profile người dùng
  getProfile: async () => {
    try {
      const response = await api.get("/profile/me");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy thông tin profile thất bại",
      };
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.patch(`/profile/${userId}`, profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Cập nhật profile thất bại",
      };
    }
  },

  // Upload avatar
  uploadAvatar: async (formData) => {
    try {
      const response = await api.post("/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Upload avatar thất bại",
      };
    }
  },

  // Lấy danh sách thú cưng của user
  getPets: async () => {
    try {
      const response = await api.get("/profile/pets");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách thú cưng thất bại",
      };
    }
  },

  // Lấy thông tin thú cưng theo ID
  getPetById: async (petId) => {
    try {
      const response = await api.get(`/profile/pets/${petId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy thông tin thú cưng thất bại",
      };
    }
  },

  // Thêm thú cưng mới
  addPet: async (petData) => {
    try {
      const response = await api.post("/profile/pets", petData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Thêm thú cưng thất bại",
      };
    }
  },

  // Cập nhật thông tin thú cưng
  updatePet: async (petId, petData) => {
    try {
      const response = await api.patch(`/profile/pets/${petId}`, petData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Cập nhật thú cưng thất bại",
      };
    }
  },

  // Xóa thú cưng
  deletePet: async (petId) => {
    try {
      const response = await api.delete(`/profile/pets/${petId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Xóa thú cưng thất bại",
      };
    }
  },

  // Lấy danh sách địa chỉ của user
  getAddresses: async () => {
    try {
      const response = await api.get("/profile/addresses");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Lấy danh sách địa chỉ thất bại",
      };
    }
  },

  // Thêm địa chỉ mới
  addAddress: async (addressData) => {
    try {
      const response = await api.post("/profile/addresses", addressData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Thêm địa chỉ thất bại",
      };
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.patch(
        `/profile/addresses/${addressId}`,
        addressData,
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Cập nhật địa chỉ thất bại",
      };
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (addressId) => {
    try {
      const response = await api.delete(`/profile/addresses/${addressId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Xóa địa chỉ thất bại",
      };
    }
  },

  // Lấy danh sách thông báo
  getNotifications: async () => {
    try {
      console.log("[profileAPI] getNotifications called");
      const response = await api.get("/profile/notifications");
      console.log("[profileAPI] getNotifications response:", response);
      console.log(
        "[profileAPI] getNotifications response.data:",
        response.data,
      );
      console.log("[profileAPI] response.data type:", typeof response.data);
      console.log(
        "[profileAPI] response.data isArray:",
        Array.isArray(response.data),
      );

      // Xử lý trường hợp response.data có thể là object với thuộc tính data
      let notificationsData = response.data;
      if (
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
      ) {
        if (response.data.data) {
          notificationsData = response.data.data;
          console.log(
            "[profileAPI] Using response.data.data:",
            notificationsData,
          );
        } else if (response.data.notifications) {
          notificationsData = response.data.notifications;
          console.log(
            "[profileAPI] Using response.data.notifications:",
            notificationsData,
          );
        } else if (response.data.content) {
          notificationsData = response.data.content;
          console.log(
            "[profileAPI] Using response.data.content:",
            notificationsData,
          );
        }
      }

      console.log("[profileAPI] Final notifications data:", notificationsData);
      return { success: true, data: notificationsData };
    } catch (error) {
      console.error("[profileAPI] getNotifications error:", error);
      console.error(
        "[profileAPI] getNotifications error.response:",
        error.response,
      );

      return {
        success: false,
        error: error.response?.data?.message || "Lấy thông báo thất bại",
      };
    }
  },

  // Đánh dấu thông báo đã xem
  markNotificationAsSeen: async (notificationId) => {
    try {
      const response = await api.patch(
        `/profile/notifications/${notificationId}/seen`,
        { seen: true },
      );
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Đánh dấu thông báo thất bại",
      };
    }
  },
};

export default api;
