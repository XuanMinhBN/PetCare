import React from "react";

function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  ...props
}) {
  const base =
    "w-full py-3 rounded-xl text-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-white text-emerald-800 hover:bg-emerald-50 focus:ring-white/60"
      : variant === "outline"
      ? "bg-transparent text-white border-2 border-white/80 hover:bg-white/10"
      : "";

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed hover:bg-white"
    : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${disabledStyles}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
