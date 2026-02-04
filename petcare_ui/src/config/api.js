// API Configuration
export const API_CONFIG = {
  BASE_URL: (() => {
    const url = process.env.REACT_APP_API_URL || "http://localhost:8080";
    return url.endsWith("/api") ? url : `${url}/api`;
  })(),
  // BASE_URL: "/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // CORS configuration
  WITH_CREDENTIALS: false,
  CROSS_DOMAIN: true,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  // Store endpoints
  STORE: {
    PRODUCTS: "/catalog/products",
    PRODUCT_BY_ID: (id) => `/catalog/products/${id}`,
    CART: "/store/cart",
    CART_ADD: "/store/cart/add",
    CART_UPDATE: (id) => `/store/cart/${id}`,
    CART_REMOVE: (id) => `/store/cart/${id}`,
    ORDERS: "/store/orders",
    ORDER_BY_ID: (id) => `/store/orders/${id}`,
  },

  // Services endpoints
  SERVICES: {
    LIST: "/catalog/services",
    BY_ID: (id) => `/services/${id}`,
    BOOK: "/services/book",
    HISTORY: "/services/history",
    CANCEL: (id) => `/services/cancel/${id}`,
  },

  // Booking endpoints
  BOOKING: {
    APPOINTMENTS: "/booking/appointments",
    APPOINTMENTS_PAGE: (page, limit) =>
      `/booking/appointments?page=${page}&limit=${limit}`,
    CREATE_APPOINTMENT: "/booking/appointments",
    COMPLETE_APPOINTMENT: (id) => `/booking/appointments/${id}/complete`,
    CANCEL_APPOINTMENT: (id) => `/booking/appointments/${id}/cancel`,
    CONFIRM_APPOINTMENT: (id) => `/booking/appointments/${id}/confirm`,
    SERVICES: "/booking/services",
  },

  // Pet endpoints
  PETS: {
    LIST: "/pets",
    CREATE: "/pets",
    UPDATE: (id) => `/pets/${id}`,
    DELETE: (id) => `/pets/${id}`,
  },
};
