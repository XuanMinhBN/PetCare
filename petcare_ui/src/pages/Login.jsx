import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import Panel from "../components/Panel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";

function Login({ goHome, goLanding }) {
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

            {state.error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {state.error}
              </div>
            )}

            <Button onClick={handleLogin} disabled={state.loading}>
              {state.loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default Login;
