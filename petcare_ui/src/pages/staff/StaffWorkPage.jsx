import React from "react";

const StaffWorkPage = ({ onNavigate, onBack }) => {
  const workOptions = [
    {
      id: "staff-orders",
      title: "Duyệt đơn hàng",
      description: "Xem và duyệt các đơn hàng mới",
      icon: "📦",
    },
    {
      id: "staff-bookings",
      title: "Duyệt lịch hẹn",
      description: "Xem và duyệt các lịch hẹn chăm sóc",
      icon: "📅",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with back button */}
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
            Trang làm việc
          </h1>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div className="space-y-4">
          {workOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => onNavigate && onNavigate(option.id)}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{option.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="text-green-600">
                  <svg
                    className="w-6 h-6"
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
  );
};

export default StaffWorkPage;
