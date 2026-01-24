import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import Panel from "../components/Panel";
import Input from "../components/Input";
import Button from "../components/Button";
import { useApp } from "../context/AppContext";

function ResetPassword({ goLogin, goLanding, goForgotPassword }) {
  const { state, actions } = useApp();
  const [formData, setFormData] = useState({
    key: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [tokenFromUrl, setTokenFromUrl] = useState(false);

  // Đọc token từ URL query parameter khi component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    
    if (token) {
      setFormData((prev) => ({ ...prev, key: token }));
      setTokenFromUrl(true);
      // Xóa token khỏi URL để bảo mật
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      actions.clearError();
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSuccessMessage("");

    // Nếu không có token từ URL, yêu cầu nhập token
    if (!tokenFromUrl && !formData.key) {
      actions.setError("Vui lòng nhập mã đặt lại");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      actions.setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      actions.setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.newPassword.length < 6) {
      actions.setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    const result = await actions.finishPasswordReset({
      key: formData.key,
      newPassword: formData.newPassword,
    });

    if (result.success) {
      setSuccessMessage(
        "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới."
      );
      actions.clearError();
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
                Đặt lại mật khẩu
              </h2>
              <p className="text-sm text-emerald-900/80 text-center mt-1">
                {tokenFromUrl
                  ? "Nhập mật khẩu mới của bạn"
                  : "Nhập mã đặt lại và mật khẩu mới của bạn"}
              </p>
            </div>

            {!tokenFromUrl && (
              <Input
                placeholder="Mã đặt lại (từ email)"
                value={formData.key}
                onChange={(e) => handleChange("key", e.target.value)}
              />
            )}
            
            {tokenFromUrl && (
              <div className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded text-center">
                ✓ Mã đặt lại đã được xác nhận từ email
              </div>
            )}
            <Input
              placeholder="Mật khẩu mới"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
            />
            <Input
              placeholder="Xác nhận mật khẩu mới"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
              {state.loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
            </Button>

            <div className="flex items-center justify-between text-sm text-emerald-900/80">
              <button
                onClick={goForgotPassword}
                className="hover:text-emerald-900 font-medium"
              >
                Chưa có mã? Gửi lại
              </button>
              <button
                onClick={goLogin}
                className="hover:text-emerald-900 font-medium"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default ResetPassword;
