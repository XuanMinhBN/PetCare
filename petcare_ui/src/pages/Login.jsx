import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Panel from "../components/Panel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";
import { GoogleLogin } from "@react-oauth/google";

function Login({ goHome, goLanding, goForgotPassword, goResetPassword }) {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Dọn dẹp lỗi khi component unmount
  useEffect(() => {
    return () => {
      actions.clearError();
    };
  }, []);

  const handleInputChange = (field, value) => {
    console.log(`Input changed - ${field}:`, value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("New form data:", newData);
      return newData;
    });
  };

  const handleLogin = async () => {
    // Debug: Log form data
    console.log("Form data:", formData);
    console.log("Email length:", formData.email?.length);
    console.log("Password length:", formData.password?.length);

    if (!formData.email || !formData.password) {
      console.log("Validation failed - missing data");
      actions.setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    console.log("Validation passed, attempting login...");
    const result = await actions.login(formData);
    if (result.success) {
      goHome();
    }
    // Nếu đăng nhập thất bại, chỉ hiển thị lỗi, không redirect
  };

  return (
    <div className="min-h-screen auth-bg flex items-center justify-center px-4">
      {/* Back button */}
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
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />

            <div className="text-right">
              <button
                type="button"
                onClick={goForgotPassword}
                className="text-sm text-green-400 hover:text-white font-medium"
              >
                Quên mật khẩu?
              </button>
              {goResetPassword && (
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={goResetPassword}
                    className="text-xs text-green-100 hover:text-white font-medium"
                  >
                    Đã có mã? Đặt lại mật khẩu
                  </button>
                </div>
              )}
            </div>

            {state.error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {state.error}
              </div>
            )}

            <Button onClick={handleLogin} disabled={state.loading}>
              {state.loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-600 text-sm font-medium">HOẶC</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <div className="w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const credential = credentialResponse?.credential;
                  if (!credential) {
                    actions.setError("Không nhận được credential từ Google");
                    return;
                  }
                  actions.setLoading(true);
                  const result = await actions.loginWithGoogle({ credential });
                  actions.setLoading(false);
                  if (result && result.success) {
                    goHome();
                  }
                }}
                onError={() => {
                  actions.setError("Đăng nhập Google thất bại");
                }}
              />
            </div>

            {/* <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng nhập với Facebook
            </button> */}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Login;
