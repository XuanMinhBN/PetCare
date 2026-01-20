import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { adminAPI } from "../../services/adminAPI";

const AdminDashboard = ({ onNavigate }) => {
  const { state, isAdmin, hasRole } = useApp();
  const { user } = state;
  const [stats, setStats] = useState([
    {
      label: "Tổng sản phẩm",
      value: "0",
      icon: "🛍️",
      color: "text-blue-600",
    },
    {
      label: "Dịch vụ hiện có",
      value: "0",
      icon: "🔧",
      color: "text-green-600",
    },
    {
      label: "Tổng người dùng",
      value: "0",
      icon: "👥",
      color: "text-purple-600",
    },
  ]);
  const [loading, setLoading] = useState(true);

  const adminMenus = [
    {
      id: "products",
      title: "Quản lý Sản phẩm",
      description: "Thêm, sửa, xóa sản phẩm trong cửa hàng",
      icon: "🛍️",
      color: "bg-blue-500",
    },
    {
      id: "services",
      title: "Quản lý Dịch vụ",
      description: "Quản lý các dịch vụ chăm sóc thú cưng",
      icon: "🔧",
      color: "bg-green-500",
    },
    {
      id: "users",
      title: "Quản lý Người dùng",
      description: "Quản lý tài khoản và thông tin khách hàng",
      icon: "👥",
      color: "bg-purple-500",
    },
  ];

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load dữ liệu từ các API
      const [productsResult, servicesResult, usersResult] = await Promise.all([
        adminAPI.products.getAllProducts(),
        adminAPI.services.getAllServices(),
        adminAPI.users.getAllUsers(),
      ]);

      let productCount = 0;
      let serviceCount = 0;
      let userCount = 0;

      // Đếm sản phẩm
      if (productsResult.success) {
        const productsData = productsResult.data;
        if (Array.isArray(productsData)) {
          productCount = productsData.length;
        } else if (
          productsData.content &&
          Array.isArray(productsData.content)
        ) {
          productCount = productsData.content.length;
        } else if (
          productsData.products &&
          Array.isArray(productsData.products)
        ) {
          productCount = productsData.products.length;
        }
      }

      // Đếm dịch vụ
      if (servicesResult.success) {
        const servicesData = servicesResult.data;
        if (Array.isArray(servicesData)) {
          serviceCount = servicesData.length;
        } else if (
          servicesData.content &&
          Array.isArray(servicesData.content)
        ) {
          serviceCount = servicesData.content.length;
        } else if (
          servicesData.services &&
          Array.isArray(servicesData.services)
        ) {
          serviceCount = servicesData.services.length;
        }
      }

      // Đếm người dùng
      if (usersResult.success) {
        const usersData = usersResult.data;
        if (Array.isArray(usersData)) {
          userCount = usersData.length;
        } else if (usersData.content && Array.isArray(usersData.content)) {
          userCount = usersData.content.length;
        } else if (usersData.users && Array.isArray(usersData.users)) {
          userCount = usersData.users.length;
        }
      }

      // Cập nhật stats
      setStats([
        {
          label: "Tổng sản phẩm",
          value: productCount.toString(),
          icon: "🛍️",
          color: "text-blue-600",
        },
        {
          label: "Dịch vụ hiện có",
          value: serviceCount.toString(),
          icon: "🔧",
          color: "text-green-600",
        },
        {
          label: "Tổng người dùng",
          value: userCount.toString(),
          icon: "👥",
          color: "text-purple-600",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Quản lý hệ thống PetCare</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Xin chào, {user?.fullName || user?.name || "Admin"}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {user?.role || "ROLE_ADMIN"}
              </span>
              <button
                onClick={() => onNavigate && onNavigate("home")}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                      <span className="ml-2 text-gray-500">Đang tải...</span>
                    </div>
                  ) : (
                    <p className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Menus - chỉ hiển thị cho ADMIN */}
        {isAdmin() && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Quản lý hệ thống
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminMenus.map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => onNavigate && onNavigate(`admin-${menu.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                    <div className="flex items-center mb-4">
                      <div
                        className={`w-12 h-12 ${menu.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}
                      >
                        {menu.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {menu.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{menu.description}</p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      <span>Quản lý</span>
                      <svg
                        className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
