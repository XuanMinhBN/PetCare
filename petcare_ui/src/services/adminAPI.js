import api from "./api";

// Admin API Services
export const adminAPI = {
  // Product Management
  products: {
    // Lấy danh sách tất cả sản phẩm (admin)
    getAllProducts: async (params = {}) => {
      try {
        const response = await api.get(`/admin/products`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy danh sách sản phẩm thất bại",
        };
      }
    },

    // Tạo sản phẩm mới
    createProduct: async (productData) => {
      try {
        const response = await api.post("/admin/products", productData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Tạo sản phẩm thất bại",
        };
      }
    },

    // Cập nhật sản phẩm
    updateProduct: async (productId, productData) => {
      try {
        const response = await api.patch(
          `/admin/products/${productId}`,
          productData
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Cập nhật sản phẩm thất bại",
        };
      }
    },

    // Xóa sản phẩm
    deleteProduct: async (productId) => {
      try {
        const response = await api.delete(`/admin/products/${productId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Xóa sản phẩm thất bại",
        };
      }
    },

    // Upload hình ảnh sản phẩm
    uploadProductImage: async (productId, imageFile) => {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await api.post(
          `/admin/products/${productId}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Upload hình ảnh thất bại",
        };
      }
    },
  },

  // Order Management
  orders: {
    // Lấy danh sách đơn hàng
    getAllOrders: async (page = 1, limit = 20, status = "", search = "") => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && { status }),
          ...(search && { search }),
        });

        const response = await api.get(`/admin/orders?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy danh sách đơn hàng thất bại",
        };
      }
    },

    // Lấy chi tiết đơn hàng
    getOrderById: async (orderId) => {
      try {
        const response = await api.get(`/admin/orders/${orderId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy chi tiết đơn hàng thất bại",
        };
      }
    },

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus: async (orderId, status) => {
      try {
        const response = await api.patch(`/admin/orders/${orderId}/status`, {
          status,
        });
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Cập nhật trạng thái đơn hàng thất bại",
        };
      }
    },
  },

  // User Management
  users: {
    // Lấy danh sách người dùng
    getAllUsers: async (page = 1, limit = 20, search = "", role = "") => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(role && { role }),
        });

        const response = await api.get(`/admin/users?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Lấy danh sách người dùng thất bại",
        };
      }
    },

    // Lấy chi tiết người dùng
    getUserById: async (userId) => {
      try {
        const response = await api.get(`/admin/users/${userId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy chi tiết người dùng thất bại",
        };
      }
    },

    // Cập nhật thông tin người dùng
    updateUser: async (userId, userData) => {
      try {
        const response = await api.patch(`/admin/users/${userId}`, userData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Cập nhật thông tin người dùng thất bại",
        };
      }
    },

    // Khóa/mở khóa tài khoản
    toggleUserStatus: async (userId) => {
      try {
        const response = await api.patch(
          `/admin/users/${userId}/toggle-status`
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Thay đổi trạng thái người dùng thất bại",
        };
      }
    },
  },

  // Service Management
  services: {
    // Lấy danh sách dịch vụ (admin)
    getAllServices: async (page = 1, limit = 20, search = "", type = "") => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(type && { type }),
        });

        const response = await api.get(`/admin/services?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy danh sách dịch vụ thất bại",
        };
      }
    },

    // Tạo dịch vụ mới
    createService: async (serviceData) => {
      try {
        const response = await api.post("/admin/services", serviceData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Tạo dịch vụ thất bại",
        };
      }
    },

    // Cập nhật dịch vụ
    updateService: async (serviceId, serviceData) => {
      try {
        const response = await api.patch(
          `/admin/services/${serviceId}`,
          serviceData
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Cập nhật dịch vụ thất bại",
        };
      }
    },

    // Xóa dịch vụ
    deleteService: async (serviceId) => {
      try {
        const response = await api.delete(`/admin/services/${serviceId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Xóa dịch vụ thất bại",
        };
      }
    },

    // Lấy danh sách đặt lịch dịch vụ
    getServiceBookings: async (
      page = 1,
      limit = 20,
      status = "",
      serviceId = ""
    ) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && { status }),
          ...(serviceId && { serviceId }),
        });

        const response = await api.get(`/admin/services/bookings?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy danh sách đặt lịch thất bại",
        };
      }
    },

    // Cập nhật trạng thái đặt lịch
    updateBookingStatus: async (bookingId, status) => {
      try {
        const response = await api.patch(
          `/admin/services/bookings/${bookingId}/status`,
          { status }
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Cập nhật trạng thái đặt lịch thất bại",
        };
      }
    },
  },

  // Pet Management
  pets: {
    // Lấy danh sách thú cưng (admin)
    getAllPets: async (page = 1, limit = 20, search = "", type = "") => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(type && { type }),
        });

        const response = await api.get(`/admin/pets?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy danh sách thú cưng thất bại",
        };
      }
    },

    // Lấy chi tiết thú cưng
    getPetById: async (petId) => {
      try {
        const response = await api.get(`/admin/pets/${petId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy chi tiết thú cưng thất bại",
        };
      }
    },

    // Cập nhật thông tin thú cưng
    updatePet: async (petId, petData) => {
      try {
        const response = await api.patch(`/admin/pets/${petId}`, petData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Cập nhật thông tin thú cưng thất bại",
        };
      }
    },

    // Xóa thú cưng
    deletePet: async (petId) => {
      try {
        const response = await api.delete(`/admin/pets/${petId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Xóa thú cưng thất bại",
        };
      }
    },
  },

  // Service Management
  services: {
    // Lấy danh sách tất cả dịch vụ (admin)
    getAllServices: async () => {
      try {
        const response = await api.get(`/admin/services`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy danh sách dịch vụ thất bại",
        };
      }
    },

    // Tạo dịch vụ mới
    createService: async (serviceData) => {
      try {
        const response = await api.post("/admin/services", serviceData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Tạo dịch vụ thất bại",
        };
      }
    },

    // Cập nhật dịch vụ
    updateService: async (serviceId, serviceData) => {
      try {
        const response = await api.patch(
          `/admin/services/${serviceId}`,
          serviceData
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Cập nhật dịch vụ thất bại",
        };
      }
    },

    // Xóa dịch vụ
    deleteService: async (serviceId) => {
      try {
        const response = await api.delete(`/admin/services/${serviceId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Xóa dịch vụ thất bại",
        };
      }
    },
  },

  // User Management
  users: {
    // Lấy danh sách tất cả người dùng (admin)
    getAllUsers: async () => {
      try {
        const response = await api.get(`/admin/users`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Lấy danh sách người dùng thất bại",
        };
      }
    },

    // Tạo người dùng mới
    createUser: async (userData) => {
      try {
        const response = await api.post("/admin/users", userData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Tạo người dùng thất bại",
        };
      }
    },

    // Cập nhật người dùng
    updateUser: async (userId, userData) => {
      try {
        const response = await api.patch(`/admin/users/${userId}`, userData);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Cập nhật người dùng thất bại",
        };
      }
    },

    // Xóa người dùng
    deleteUser: async (userId) => {
      try {
        const response = await api.delete(`/admin/users/${userId}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || "Xóa người dùng thất bại",
        };
      }
    },

    // Thay đổi trạng thái người dùng
    toggleUserStatus: async (userId) => {
      try {
        const response = await api.patch(
          `/admin/users/${userId}/toggle-status`
        );
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Thay đổi trạng thái thất bại",
        };
      }
    },
  },

  // Reports & Analytics
  reports: {
    // Thống kê tổng quan
    getDashboardStats: async () => {
      try {
        const response = await api.get("/admin/reports/dashboard");
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy thống kê dashboard thất bại",
        };
      }
    },

    // Báo cáo doanh thu
    getRevenueReport: async (startDate, endDate, period = "daily") => {
      try {
        const params = new URLSearchParams({
          startDate,
          endDate,
          period,
        });

        const response = await api.get(`/admin/reports/revenue?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy báo cáo doanh thu thất bại",
        };
      }
    },

    // Báo cáo sản phẩm bán chạy
    getTopProducts: async (limit = 10, period = "month") => {
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          period,
        });

        const response = await api.get(`/admin/reports/top-products?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Lấy báo cáo sản phẩm bán chạy thất bại",
        };
      }
    },

    // Báo cáo người dùng
    getUserReport: async (period = "month") => {
      try {
        const params = new URLSearchParams({ period });
        const response = await api.get(`/admin/reports/users?${params}`);
        return { success: true, data: response.data };
      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.message || "Lấy báo cáo người dùng thất bại",
        };
      }
    },
  },
};

export default adminAPI;
