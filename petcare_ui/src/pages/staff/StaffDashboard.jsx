import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

const StaffDashboard = ({ onNavigate }) => {
  const { state } = useApp();
  const { user } = state;

  const staffMenus = [
    {
      id: "staff-work",
      title: "Trang làm việc",
      description: "Duyệt đơn hàng và lịch hẹn chăm sóc",
      icon: "💼",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Staff Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Quản lý công việc PetCare</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Xin chào, {user?.fullName || user?.name || "Staff"}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {user?.role || "ROLE_STAFF"}
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
        {/* Staff Menus */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Công việc Staff
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staffMenus.map((menu) => (
              <div
                key={menu.id}
                onClick={() => onNavigate && onNavigate(menu.id)}
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
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {menu.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{menu.description}</p>
                  <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium group-hover:text-emerald-700">
                    <span>Làm việc</span>
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
      </div>
    </div>
  );
};

export default StaffDashboard;
