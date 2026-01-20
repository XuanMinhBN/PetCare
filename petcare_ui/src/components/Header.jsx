import React from "react";
import NotificationBadge from "./NotificationBadge";
import { useApp } from "../context/AppContext";

function Header({ title = "", onBack }) {
  const { state } = useApp();
  return (
    <div className="w-full bg-emerald-700 text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
            >
              <span className="sr-only">Quay lại</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          ) : (
            <div className="h-9 w-9" />
          )}
        </div>
        <div className="text-2xl font-extrabold tracking-wide">PETFIT</div>
        <div className="flex items-center gap-2">
          {state.isAuthenticated && (
            <NotificationBadge
              onClick={() => {
                // Điều hướng đến trang thông báo
                window.location.href = "/notifications";
              }}
              className="text-white hover:text-emerald-200"
            />
          )}
          <div className="h-9 w-9" />
        </div>
      </div>
      {title && (
        <div className="bg-emerald-50 text-emerald-700 border-t border-emerald-200">
          <div className="mx-auto max-w-5xl px-4 py-4">
            <h1 className="text-3xl font-extrabold">{title}</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
