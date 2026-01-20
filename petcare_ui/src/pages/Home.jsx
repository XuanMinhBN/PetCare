import React from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

function Home({ goStore, current = "home", onNavigate }) {
  const { isAdmin } = useApp();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar current={current} onNavigate={onNavigate} />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-4xl font-extrabold text-emerald-700 text-center mb-4">
          Danh mục
        </h2>
        <div className="h-px bg-emerald-300 mb-6" />

        <div className="space-y-6">
          <button
            onClick={() => onNavigate("booking")}
            className="w-full bg-emerald-700 text-white rounded-3xl py-8 shadow hover:bg-emerald-600"
          >
            <div className="text-xl font-bold">Đặt lịch chăm sóc</div>
          </button>
          <button
            onClick={() => onNavigate("services")}
            className="w-full bg-emerald-700 text-white rounded-3xl py-8 shadow hover:bg-emerald-600"
          >
            <div className="text-xl font-bold">Dịch vụ</div>
          </button>
          <button
            onClick={goStore}
            className="w-full bg-emerald-700 text-white rounded-3xl py-8 shadow hover:bg-emerald-600"
          >
            <div className="text-xl font-bold">Cửa hàng</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
