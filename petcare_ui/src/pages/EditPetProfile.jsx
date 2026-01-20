import React, { useState, useEffect } from "react";
import { profileAPI } from "../services/api";

function PetProfile({ onNavigate, onBack, petId }) {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    breed: "",
    sex: "",
    dob: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (petId) {
      loadPetData();
    }
  }, [petId]);

  const loadPetData = async () => {
    try {
      setLoading(true);
      const result = await profileAPI.getPetById(petId);
      if (result.success) {
        const pet = result.data;
        setFormData({
          type: pet.type || "",
          name: pet.name || "",
          breed: pet.breed || "",
          sex: pet.sex || "",
          dob: pet.dob || "",
          notes: pet.notes || "",
        });
      } else {
        setError(result.error || "Không thể tải thông tin thú cưng");
      }
    } catch (err) {
      setError("Không thể tải thông tin thú cưng");
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

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.type.trim()) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      let result;
      if (petId) {
        // Chỉnh sửa thú cưng hiện có
        result = await profileAPI.updatePet(petId, formData);
        if (result.success) {
          alert("Thông tin thú cưng đã được cập nhật thành công!");
          onBack();
        } else {
          setError(result.error || "Cập nhật thông tin thú cưng thất bại");
        }
      } else {
        // Thêm thú cưng mới
        result = await profileAPI.addPet(formData);
        if (result.success) {
          alert("Thú cưng đã được thêm thành công!");
          onBack();
        } else {
          setError(result.error || "Thêm thú cưng thất bại");
        }
      }
    } catch (err) {
      setError(
        petId
          ? "Có lỗi xảy ra khi cập nhật thông tin thú cưng"
          : "Có lỗi xảy ra khi thêm thú cưng"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thú cưng này?")) {
      try {
        setSaving(true);
        const result = await profileAPI.deletePet(petId);
        if (result.success) {
          alert("Thú cưng đã được xóa thành công!");
          onBack();
        } else {
          setError(result.error || "Xóa thú cưng thất bại");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi xóa thú cưng");
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

          <div className="text-white font-bold text-xl flex items-center">
            <span>{petId ? "Chỉnh sửa thú cưng" : "Thêm thú cưng"}</span>
            <div className="ml-1 w-2 h-2 bg-white rounded-full"></div>
          </div>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-gray-100">
        <h1 className="text-center text-3xl font-bold text-green-600 mb-2">
          {petId ? "Chỉnh sửa thú cưng" : "Thêm thú cưng mới"}
        </h1>
        <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Tên thú cưng */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Tên thú cưng *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập tên thú cưng"
            />
          </div>

          {/* Loài */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Loài *
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                handleInputChange("type", e.target.value);
                // Reset breed khi đổi loài
                handleInputChange("breed", "");
              }}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            >
              <option value="">Chọn loài</option>
              <option value="DOG">Chó</option>
              <option value="CAT">Mèo</option>
            </select>
          </div>

          {/* Giống */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Giống
            </label>
            {formData.type === "DOG" ? (
              <select
                value={formData.breed}
                onChange={(e) => handleInputChange("breed", e.target.value)}
                className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              >
                <option value="">Chọn giống chó</option>
                <option value="Golden Retriever">Golden Retriever</option>
                <option value="Labrador">Labrador</option>
                <option value="German Shepherd">German Shepherd</option>
                <option value="French Bulldog">French Bulldog</option>
                <option value="Poodle">Poodle</option>
                <option value="Beagle">Beagle</option>
                <option value="Rottweiler">Rottweiler</option>
                <option value="Yorkshire Terrier">Yorkshire Terrier</option>
                <option value="Siberian Husky">Siberian Husky</option>
                <option value="Bulldog">Bulldog</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="Border Collie">Border Collie</option>
                <option value="Shih Tzu">Shih Tzu</option>
                <option value="Dachshund">Dachshund</option>
                <option value="Boxer">Boxer</option>
                <option value="Cocker Spaniel">Cocker Spaniel</option>
                <option value="Pitbull">Pitbull</option>
                <option value="Akita">Akita</option>
                <option value="Maltese">Maltese</option>
                <option value="Pomeranian">Pomeranian</option>
                <option value="Khác">Khác</option>
              </select>
            ) : formData.type === "CAT" ? (
              <select
                value={formData.breed}
                onChange={(e) => handleInputChange("breed", e.target.value)}
                className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              >
                <option value="">Chọn giống mèo</option>
                <option value="Persian">Persian</option>
                <option value="Maine Coon">Maine Coon</option>
                <option value="British Shorthair">British Shorthair</option>
                <option value="Scottish Fold">Scottish Fold</option>
                <option value="Ragdoll">Ragdoll</option>
                <option value="Siamese">Siamese</option>
                <option value="American Shorthair">American Shorthair</option>
                <option value="Abyssinian">Abyssinian</option>
                <option value="Sphynx">Sphynx</option>
                <option value="Birman">Birman</option>
                <option value="Russian Blue">Russian Blue</option>
                <option value="Bengal">Bengal</option>
                <option value="Oriental Shorthair">Oriental Shorthair</option>
                <option value="Devon Rex">Devon Rex</option>
                <option value="Munchkin">Munchkin</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleInputChange("breed", e.target.value)}
                className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Nhập giống"
                disabled
              />
            )}
          </div>

          {/* Giới tính */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Giới tính
            </label>
            <select
              value={formData.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Đực</option>
              <option value="FEMALE">Cái</option>
            </select>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Ngày sinh
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Ghi chú
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full p-4 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              placeholder="Nhập đặc điểm, tính cách..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 space-y-4">
          <button
            onClick={handleSubmit}
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
            ) : petId ? (
              "Cập nhật thông tin"
            ) : (
              "Thêm thú cưng"
            )}
          </button>

          {petId && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className={`w-full text-white text-xl font-bold py-4 rounded-lg shadow-lg transition duration-300 ${
                saving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Xóa thú cưng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
