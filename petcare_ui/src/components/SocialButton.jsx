import React from "react";

function SocialButton({ brand = "google", text }) {
  const isGoogle = brand === "google";
  return (
    <button className="w-full flex items-center gap-3 bg-white/95 hover:bg-white text-emerald-900 rounded-xl px-4 py-3 text-sm font-medium">
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
          isGoogle ? "bg-[#EA4335]" : "bg-[#1877F2]"
        }`}
      >
        <span className="text-white text-xs font-bold">
          {isGoogle ? "G" : "f"}
        </span>
      </span>
      <span className="truncate">{text}</span>
    </button>
  );
}

export default SocialButton;
