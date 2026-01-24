import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Panel from "../components/Panel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";

function Register({ goHome, goLogin, goLanding }) {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  // Dọn dẹp lỗi khi component unmount
  useEffect(() => {
    return () => {
      actions.clearError();
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      actions.setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      actions.setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      actions.setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Validate phone number format (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(formData.phone)) {
      actions.setError("Số điện thoại không hợp lệ");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      actions.setError("Email không hợp lệ");
      return;
    }

    const result = await actions.register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      avatar: formData.avatar || "",
      role: "ROLE_CUSTOMER",
      tier: "FREE",
      activated: true,
    });

    if (result.success) {
      alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập để sử dụng.");
      goLogin();
    }
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

      <div className="flex flex-col items-center max-w-xl">
        <Logo />
        <Panel>
          <div className="space-y-4">
            <Input
              placeholder="Họ và tên"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <Input
              placeholder="Số điện thoại"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <Input
              placeholder="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <Input
              placeholder="Xác nhận mật khẩu"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
            />

            {state.error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {state.error}
              </div>
            )}

            <Button onClick={handleRegister} disabled={state.loading}>
              {state.loading ? "Đang đăng ký..." : "Đăng ký"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-600 text-sm font-medium">HOẶC</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-50 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Đăng ký với Google
            </button>

            {/* <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng ký với Facebook
            </button> */}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Register;
