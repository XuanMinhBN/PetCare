import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/adminAPI";
import { adminAPI as apiAdmin } from "../../services/api";

const UserManagementPage = ({ onNavigate, onBack }) => {
  const [allUsers, setAllUsers] = useState([]); // Lưu tất cả users từ API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [updatingRole, setUpdatingRole] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Chỉ load users một lần khi component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API không có parameter, lấy tất cả users
      const result = await adminAPI.users.getAllUsers();

      if (result.success) {
        const data = result.data;
        
        // Xử lý dữ liệu trả về (có thể là array hoặc object có content/users)
        let usersData = [];
        if (Array.isArray(data)) {
          usersData = data;
        } else if (data.content && Array.isArray(data.content)) {
          usersData = data.content;
        } else if (data.users && Array.isArray(data.users)) {
          usersData = data.users;
        }

        setAllUsers(usersData);
      } else {
        setError(result.error || "Không thể tải danh sách users");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách users");
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu ở phía frontend
  const filteredUsers = React.useMemo(() => {
    let filtered = [...allUsers];

    // Lọc theo tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.phone && user.phone.includes(searchTerm))
      );
    }

    // Lọc theo vai trò
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    return filtered;
  }, [allUsers, searchTerm, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingRole(userId);
      const result = await apiAdmin.updateUserRole(userId, newRole);

      if (result.success) {
        alert("Thay đổi role thành công!");
        loadUsers(); // Reload danh sách
      } else {
        alert(result.error || "Thay đổi role thất bại!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi thay đổi role!");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      setUpdatingStatus(userId);
      const newStatus = !currentStatus;
      const result = await apiAdmin.toggleUserStatus(userId, newStatus);

      if (result.success) {
        const action = newStatus ? "mở khóa" : "khóa";
        alert(
          `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } tài khoản thành công!`
        );
        loadUsers(); // Reload danh sách
      } else {
        alert(result.error || "Thay đổi trạng thái tài khoản thất bại!");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi thay đổi trạng thái tài khoản!");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Admin";
      case "ROLE_STAFF":
        return "Staff";
      case "ROLE_CUSTOMER":
        return "Khách hàng";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "bg-red-100 text-red-800";
      case "ROLE_STAFF":
        return "bg-blue-100 text-blue-800";
      case "ROLE_CUSTOMER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-emerald-700">
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-emerald-700">
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
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={loadUsers}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-emerald-700">
        <button onClick={onBack} className="bg-white rounded-lg p-2 shadow-lg">
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

      <div className="px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Quản lý người dùng
          </h1>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên, email hoặc số điện thoại người dùng..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo vai trò
                {roleFilter !== "ALL" && (
                  <span className="ml-2 text-xs text-green-600">
                    (Đang lọc)
                  </span>
                )}
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  roleFilter !== "ALL"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="ROLE_ADMIN">Quản trị viên</option>
                <option value="ROLE_STAFF">Nhân viên</option>
                <option value="ROLE_CUSTOMER">Khách hàng</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>
                Hiển thị <span className="font-semibold text-gray-900">{filteredUsers.length}</span> người dùng
                {(searchTerm || roleFilter !== "ALL") && (
                  <span className="ml-1 text-green-600">
                    (đã lọc theo{" "}
                    {searchTerm && roleFilter !== "ALL" ? (
                      <>
                        từ khóa "<span className="font-medium">{searchTerm}</span>" và vai trò{" "}
                        <span className="font-medium">
                          {roleFilter === "ROLE_ADMIN"
                            ? "Quản trị viên"
                            : roleFilter === "ROLE_STAFF"
                            ? "Nhân viên"
                            : roleFilter === "ROLE_CUSTOMER"
                            ? "Khách hàng"
                            : roleFilter}
                        </span>
                      </>
                    ) : searchTerm ? (
                      <>
                        từ khóa "<span className="font-medium">{searchTerm}</span>"
                      </>
                    ) : (
                      <>
                        vai trò{" "}
                        <span className="font-medium">
                          {roleFilter === "ROLE_ADMIN"
                            ? "Quản trị viên"
                            : roleFilter === "ROLE_STAFF"
                            ? "Nhân viên"
                            : roleFilter === "ROLE_CUSTOMER"
                            ? "Khách hàng"
                            : roleFilter}
                        </span>
                      </>
                    )}
                    )
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("ALL");
              }}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              🔄 Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <p className="text-gray-600 text-lg">
                {searchTerm || roleFilter !== "ALL"
                  ? "Không tìm thấy người dùng phù hợp với bộ lọc"
                  : "Chưa có người dùng nào"}
              </p>
              {(searchTerm || roleFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setRoleFilter("ALL");
                  }}
                  className="mt-2 text-green-600 hover:text-green-700 font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                {/* User Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {getRoleDisplayName(user.role)}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.activated
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.activated ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {user.name || "N/A"}
                  </h3>

                  <p className="text-xs text-gray-600 truncate">
                    📧 {user.email || "N/A"}
                  </p>

                  {user.phone && (
                    <p className="text-xs text-gray-600">📞 {user.phone}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    🎖️ Tier: {user.tier || "FREE"}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-3 space-y-2">
                  {/* Role Change */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Thay đổi role:
                    </label>
                    <div className="flex space-x-1">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        disabled={updatingRole === user.id}
                        className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="ROLE_CUSTOMER">Khách hàng</option>
                        <option value="ROLE_STAFF">Staff</option>
                        <option value="ROLE_ADMIN">Admin</option>
                      </select>
                      {updatingRole === user.id && (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Trạng thái tài khoản:
                    </label>
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          handleToggleStatus(user.id, user.activated)
                        }
                        disabled={updatingStatus === user.id}
                        className={`flex-1 text-xs px-3 py-1 rounded font-medium transition-colors ${
                          user.activated
                            ? "bg-red-100 text-red-800 hover:bg-red-200"
                            : "bg-green-100 text-green-800 hover:bg-green-200"
                        } ${
                          updatingStatus === user.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {updatingStatus === user.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                            Đang xử lý...
                          </div>
                        ) : user.activated ? (
                          "🔒 Khóa tài khoản"
                        ) : (
                          "🔓 Mở khóa tài khoản"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
