import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { profileAPI } from "../services/api";

function EditProfile({ onNavigate, onBack }) {
  const { state } = useApp();
  const [profile, setProfile] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const result = await profileAPI.getProfile();
      if (result.success) {
        const profileData = result.data;
        setProfile(profileData);
        // Lưu profile ID để dùng cho cập nhật
        setProfileId(profileData.id || state.user?.id || state.user?.sub);
        setFormData({
          name: profileData.name || state.user?.name || "",
          email: profileData.email || state.user?.email || "",
          phone: profileData.phone || "",
        });
        setAvatarPreview(profileData.avatar || state.user?.avatar || null);
      }
    } catch (err) {
      setError("Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Chỉ chấp nhận file ảnh (JPG, PNG, GIF)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("Kích thước file không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const result = await profileAPI.uploadAvatar(formData);
      if (result.success) {
        return result.data.avatarUrl;
      } else {
        setError(result.error || "Upload ảnh thất bại");
        return null;
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi upload ảnh");
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);
      setError(null);

      // Upload avatar first if there's a new one
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          return; // Stop if avatar upload failed
        }
      }

      // Update profile with new avatar
      const updateData = {
        ...formData,
        avatar: avatarUrl,
      };

      // Lấy user ID từ profile hoặc state
      const userId =
        profileId || profile?.id || state.user?.id || state.user?.sub;

      if (!userId) {
        setError("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const result = await profileAPI.updateProfile(userId, updateData);
      if (result.success) {
        alert("Thông tin đã được cập nhật thành công!");
        onBack();
      } else {
        setError(result.error || "Cập nhật thông tin thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 h-full">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-800 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-800 rounded-full ml-1"></div>
                  <div className="w-2 h-2 bg-green-800 rounded-full ml-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="bg-white rounded-lg p-2 shadow-lg"
          >
            <svg
              className="w-6 h-6 text-black"
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

          <div className="text-white font-bold text-xl flex items-center">
            <span>PETFIT</span>
            <div className="ml-1 w-2 h-2 bg-white rounded-full"></div>
          </div>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-gray-100">
        <h1 className="text-center text-3xl font-bold text-green-600 mb-8">
          Thông tin
        </h1>

        {/* Profile Picture */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-green-600 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center ${
                  avatarPreview ? "hidden" : "flex"
                }`}
              >
                <svg
                  className="w-16 h-16 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Upload Button */}
            <label className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors cursor-pointer">
              {uploadingAvatar ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Avatar Upload Info */}
        {avatarFile && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Đã chọn: {avatarFile.name} (
              {(avatarFile.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Họ và Tên */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Họ và Tên
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Điện thoại */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập email"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <div className="mt-12">
          <button
            onClick={handleConfirm}
            disabled={saving || uploadingAvatar}
            className={`w-full text-white text-xl font-bold py-4 rounded-lg shadow-lg transition duration-300 ${
              saving || uploadingAvatar
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving || uploadingAvatar ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {uploadingAvatar ? "Đang upload ảnh..." : "Đang lưu..."}
              </div>
            ) : (
              "Xác nhận"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
