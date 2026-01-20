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

      <div className="flex flex-col items-center">
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
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Register;
