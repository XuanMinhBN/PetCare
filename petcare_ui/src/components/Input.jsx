import React from "react";

function Input({ placeholder, type = "text", value, onChange, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl bg-white/95 placeholder-emerald-900/60 text-emerald-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      {...props}
    />
  );
}

export default Input;
