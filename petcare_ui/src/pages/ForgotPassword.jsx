import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Panel from "../components/Panel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";

function ForgotPassword({ goLogin, goLanding, goResetPassword }) {
  const { state, actions } = useApp();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    return () => {
      actions.clearError();
    };
  }, []);

  const handleSubmit = async () => {
    setSuccessMessage("");
    const result = await actions.requestPasswordReset(email);
    if (result.success) {
      setSuccessMessage(
        "Yêu cầu thành công! Vui lòng kiểm tra email để nhận mã đặt lại."
      );
    }
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-4">
      <button
        onClick={goLanding}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-3 rounded-full"
      >
        <svg
          className="w-6 h-6 text-white"
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

      <div className="flex flex-col items-center">
        <Logo />
        <Panel>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-emerald-900 text-center">
                Quên mật khẩu
              </h2>
              <p className="text-sm text-emerald-900/80 text-center mt-1">
                Nhập email của bạn để nhận mã đặt lại mật khẩu
              </p>
            </div>

            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {state.error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {state.error}
              </div>
            )}

            {successMessage && (
              <div className="text-emerald-700 text-sm text-center bg-emerald-50 p-2 rounded">
                {successMessage}
              </div>
            )}

            <Button onClick={handleSubmit} disabled={state.loading}>
              {state.loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>

            <div className="flex items-center justify-between text-sm text-emerald-900/80">
              <button
                onClick={goLogin}
                className="hover:text-emerald-900 font-medium"
              >
                Quay lại đăng nhập
              </button>
              <button
                onClick={goResetPassword}
                className="hover:text-emerald-900 font-medium"
              >
                Đã có mã? Đặt lại ngay
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default ForgotPassword;
