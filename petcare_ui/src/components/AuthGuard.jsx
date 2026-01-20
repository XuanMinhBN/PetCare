import React from "react";
import { useApp } from "../context/AppContext";
import { RoleUtils } from "../constants/roles";

/**
 * AuthGuard component để bảo vệ các trang cần phân quyền
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con cần được bảo vệ
 * @param {string|Array} props.requiredRole - Role hoặc array roles được phép truy cập
 * @param {React.ReactNode} props.fallback - Component hiển thị khi không có quyền
 * @param {boolean} props.requireAuth - Có yêu cầu đăng nhập hay không (default: true)
 */
function AuthGuard({
  children,
  requiredRole = null,
  fallback = null,
  requireAuth = true,
}) {
  const { state } = useApp();
  const { user, isAuthenticated } = state;

  // Kiểm tra authentication
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-4">
            🔒 Truy cập bị từ chối
          </div>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng nhập để truy cập trang này.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole) {
    const hasPermission = Array.isArray(requiredRole)
      ? requiredRole.some((role) => RoleUtils.hasRole(user, role))
      : RoleUtils.hasRole(user, requiredRole);

    if (!hasPermission) {
      return (
        fallback || (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-600 text-xl font-semibold mb-4">
                🚫 Không có quyền truy cập
              </div>
              <p className="text-gray-600 mb-4">
                Bạn không có quyền truy cập trang này.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                Role hiện tại:{" "}
                <span className="font-mono">{user?.role || "N/A"}</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Quay lại
              </button>
            </div>
          </div>
        )
      );
    }
  }

  // Hiển thị component con nếu có quyền
  return children;
}

export default AuthGuard;
