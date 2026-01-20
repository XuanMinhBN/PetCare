import React, { createContext, useContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";
import { RoleUtils } from "../constants/roles";
import notificationService from "../services/notificationService";

// Initial state - Không còn đọc từ localStorage ở đây nữa
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Bắt đầu với loading = true để chờ xác thực ban đầu
  error: null,
  cart: [],
  cartCount: 0,
  services: [],
  products: [],
  pets: [],
  notifications: [],
  notificationCount: 0,
  unreadNotificationCount: 0,
};

// Action types - đầy đủ như ban đầu
export const ActionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  AUTH_INIT: "AUTH_INIT", // Action mới để xử lý xác thực ban đầu
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  SET_CART: "SET_CART",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_ITEM: "UPDATE_CART_ITEM",
  SET_SERVICES: "SET_SERVICES",
  SET_PRODUCTS: "SET_PRODUCTS",
  SET_PETS: "SET_PETS",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  MARK_NOTIFICATION_AS_SEEN: "MARK_NOTIFICATION_AS_SEEN",
  MARK_ALL_NOTIFICATIONS_AS_SEEN: "MARK_ALL_NOTIFICATIONS_AS_SEEN",
};

// Reducer - kết hợp logic mới và cũ
const appReducer = (state, action) => {
  switch (action.type) {
    // --- LOGIC XÁC THỰC MỚI ---
    case ActionTypes.AUTH_INIT:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        loading: false,
      };
    case ActionTypes.LOGIN_SUCCESS:
      console.log("[Reducer] LOGIN_SUCCESS with user:", action.payload.user);
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case ActionTypes.LOGOUT:
      authAPI.logout(); // Xóa token khỏi localStorage
      notificationService.reset(); // Reset notification service
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        cartCount: 0,
        notifications: [],
        notificationCount: 0,
        unreadNotificationCount: 0,
      };

    // --- CÁC ACTION CŨ GIỮ NGUYÊN ---
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case ActionTypes.SET_CART:
      const cartCount = action.payload.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      return { ...state, cart: action.payload, cartCount };
    case ActionTypes.ADD_TO_CART:
      // ... (logic giỏ hàng của bạn)
      return state; // Thay bằng logic của bạn // ... các case khác cho cart, services, products, pets

    // --- NOTIFICATION ACTIONS ---
    case ActionTypes.SET_NOTIFICATIONS:
      const notifications = action.payload || [];
      // Đảm bảo notifications là một array
      const notificationsArray = Array.isArray(notifications)
        ? notifications
        : [];
      const unreadCount = notificationsArray.filter((n) => !n.seen).length;
      return {
        ...state,
        notifications: notificationsArray,
        notificationCount: notificationsArray.length,
        unreadNotificationCount: unreadCount,
      };
    case ActionTypes.MARK_NOTIFICATION_AS_SEEN:
      const updatedNotifications = state.notifications.map((notif) =>
        notif.id === action.payload ? { ...notif, seen: true } : notif
      );
      const newUnreadCount = updatedNotifications.filter((n) => !n.seen).length;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadNotificationCount: newUnreadCount,
      };
    case ActionTypes.MARK_ALL_NOTIFICATIONS_AS_SEEN:
      const allSeenNotifications = state.notifications.map((notif) => ({
        ...notif,
        seen: true,
      }));
      return {
        ...state,
        notifications: allSeenNotifications,
        unreadNotificationCount: 0,
      };

    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hook useEffect để xác thực người dùng khi tải ứng dụng
  useEffect(() => {
    console.log("[AppContext] Initializing authentication...");
    const token = localStorage.getItem("authToken");
    let user = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          user = decodedToken;
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        localStorage.removeItem("authToken");
      }
    }
    dispatch({ type: ActionTypes.AUTH_INIT, payload: { user } });
  }, []);

  // Hook useEffect để quản lý notification service
  useEffect(() => {
    if (state.isAuthenticated) {
      // Bắt đầu polling khi user đã đăng nhập
      notificationService.startPolling();

      // Thêm listener để cập nhật state khi có thông báo mới
      const unsubscribe = notificationService.addListener((notifications) => {
        dispatch({
          type: ActionTypes.SET_NOTIFICATIONS,
          payload: notifications,
        });
      });

      return () => {
        unsubscribe();
        notificationService.stopPolling();
      };
    } else {
      // Dừng polling khi user đăng xuất
      notificationService.stopPolling();
    }
  }, [state.isAuthenticated]);

  const actions = {
    login: async (credentials) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });
      const result = await authAPI.login(credentials);
      if (result.success) {
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: result.user },
        });
        return { success: true };
      } else {
        dispatch({ type: ActionTypes.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    },
    register: async (userData) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });
      const result = await authAPI.register(userData);
      if (result.success) {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        return { success: true };
      } else {
        dispatch({ type: ActionTypes.SET_ERROR, payload: result.error });
        return { success: false, error: result.error };
      }
    },
    logout: () => {
      dispatch({ type: ActionTypes.LOGOUT });
    },
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },

    // Notification actions
    markNotificationAsSeen: (notificationId) => {
      dispatch({
        type: ActionTypes.MARK_NOTIFICATION_AS_SEEN,
        payload: notificationId,
      });
    },
    markAllNotificationsAsSeen: () => {
      dispatch({ type: ActionTypes.MARK_ALL_NOTIFICATIONS_AS_SEEN });
    },
    refreshNotifications: async () => {
      try {
        console.log("[AppContext] refreshNotifications called");
        const result = await notificationService.checkForNewNotifications();
        console.log("[AppContext] notificationService result:", result);

        if (result.success) {
          console.log(
            "[AppContext] Dispatching SET_NOTIFICATIONS with data:",
            result.data
          );
          dispatch({
            type: ActionTypes.SET_NOTIFICATIONS,
            payload: result.data,
          });
        }
        return result;
      } catch (error) {
        console.error("Error refreshing notifications:", error);
        return { success: false, error: "Failed to refresh notifications" };
      }
    },

    // Khôi phục các actions khác
    // ... (Thêm lại các action loginWithGoogle, addToCart, etc. của bạn ở đây)
  };

  const isAdmin = () => {
    // ================== DÒNG LOG GỠ LỖI QUAN TRỌNG ==================
    console.log("[isAdmin Check] Checking user object:", state.user);
    // ===============================================================
    return RoleUtils.isAdmin(state.user);
  };
  const isCustomer = () => RoleUtils.isCustomer(state.user);
  const hasRole = (role) => RoleUtils.hasRole(state.user, role);
  const hasAnyRole = (roles) => RoleUtils.hasAnyRole(state.user, roles);

  return (
    <AppContext.Provider
      value={{ state, actions, isAdmin, isCustomer, hasRole, hasAnyRole }}
    >
            {children}   {" "}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
