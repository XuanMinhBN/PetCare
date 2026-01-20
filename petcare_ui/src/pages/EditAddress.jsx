import React, { useState, useEffect } from "react";
import { profileAPI } from "../services/api";

function EditAddress({ onNavigate, onBack, addressId }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    ward: "",
    district: "",
    province: "",
    default: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (addressId) {
      loadAddressData();
    }
  }, [addressId]);

  const loadAddressData = async () => {
    try {
      setLoading(true);
      const result = await profileAPI.getAddresses();
      if (result.success) {
        const address = result.data.find((addr) => addr.id === addressId);
        if (address) {
          setFormData({
            fullName: address.fullName || "",
            phone: address.phone || "",
            line1: address.line1 || "",
            ward: address.ward || "",
            district: address.district || "",
            province: address.province || "",
            default: address.default || false,
          });
        }
      }
    } catch (err) {
      setError("Không thể tải thông tin địa chỉ");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.line1.trim() ||
      !formData.ward.trim() ||
      !formData.district.trim() ||
      !formData.province.trim()
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const result = await profileAPI.updateAddress(addressId, formData);
      if (result.success) {
        alert("Địa chỉ đã được cập nhật thành công!");
        onBack();
      } else {
        setError(result.error || "Cập nhật địa chỉ thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật địa chỉ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      try {
        setSaving(true);
        const result = await profileAPI.deleteAddress(addressId);
        if (result.success) {
          alert("Địa chỉ đã được xóa thành công!");
          onBack();
        } else {
          setError(result.error || "Xóa địa chỉ thất bại");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi xóa địa chỉ");
      } finally {
        setSaving(false);
      }
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

          <div className="text-white font-bold text-xl">Chỉnh sửa địa chỉ</div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Họ và tên người nhận */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Họ và tên người nhận *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập họ và tên người nhận"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Địa chỉ cụ thể */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Địa chỉ cụ thể *
            </label>
            <input
              type="text"
              value={formData.line1}
              onChange={(e) => handleInputChange("line1", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Số nhà, tên đường"
            />
          </div>

          {/* Phường/Xã */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Phường/Xã *
            </label>
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => handleInputChange("ward", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập phường/xã"
            />
          </div>

          {/* Quận/Huyện */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Quận/Huyện *
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => handleInputChange("district", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập quận/huyện"
            />
          </div>

          {/* Tỉnh/Thành phố */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Tỉnh/Thành phố *
            </label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập tỉnh/thành phố"
            />
          </div>

          {/* Địa chỉ mặc định */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="default"
              checked={formData.default}
              onChange={(e) => handleInputChange("default", e.target.checked)}
              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label
              htmlFor="default"
              className="ml-2 text-lg font-medium text-gray-700"
            >
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button
              type="submit"
              disabled={saving}
              className={`w-full text-white text-xl font-bold py-4 rounded-lg shadow-lg transition duration-300 ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </div>
              ) : (
                "Cập nhật địa chỉ"
              )}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className={`w-full text-white text-xl font-bold py-4 rounded-lg shadow-lg transition duration-300 ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Xóa địa chỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAddress;
