import React from "react";
import { useApp } from "../context/AppContext";

const NotificationBadge = ({ onClick, className = "" }) => {
  const { state } = useApp();
  const { unreadNotificationCount } = state;

  if (unreadNotificationCount === 0) {
    return (
      <button
        onClick={onClick}
        className={`relative p-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
        aria-label="Thông báo"
      >
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
            d="M15 17h5l-5 5v-5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      aria-label={`${unreadNotificationCount} thông báo chưa đọc`}
    >
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
          d="M15 17h5l-5 5v-5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Badge hiển thị số thông báo chưa đọc */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
        {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
      </span>
    </button>
  );
};

export default NotificationBadge;
