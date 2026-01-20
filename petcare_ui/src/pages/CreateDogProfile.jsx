import React, { useState } from "react";
import { profileAPI } from "../services/api";

function CreateDogProfile({ onNavigate, onBack }) {
  const [selectedBreed, setSelectedBreed] = useState("");
  const [activeTab, setActiveTab] = useState("breed"); // "breed" or "info"
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    dob: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const dogBreeds = [
    { id: "Golden Retriever", name: "Golden Retriever", image: "🐕" },
    { id: "Labrador", name: "Labrador", image: "🐕" },
    { id: "German Shepherd", name: "German Shepherd", image: "🐕‍🦺" },
    { id: "French Bulldog", name: "French Bulldog", image: "🐕" },
    { id: "Poodle", name: "Poodle", image: "🐩" },
    { id: "Beagle", name: "Beagle", image: "🐕" },
    { id: "Rottweiler", name: "Rottweiler", image: "🐕‍🦺" },
    { id: "Yorkshire Terrier", name: "Yorkshire Terrier", image: "🐕" },
    { id: "Siberian Husky", name: "Siberian Husky", image: "🐕‍🦺" },
    { id: "Bulldog", name: "Bulldog", image: "🐕" },
  ];

  const handleBreedSelect = (breedId) => {
    setSelectedBreed(breedId);
    setActiveTab("info");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Vui lòng nhập tên thú cưng");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const petData = {
        type: "DOG",
        name: formData.name,
        breed: selectedBreed,
        sex: formData.sex,
        dob: formData.dob,
        notes: formData.notes,
      };

      const result = await profileAPI.addPet(petData);
      if (result.success) {
        alert("Tạo hồ sơ chó thành công!");
        onBack();
      } else {
        setError(result.error || "Tạo hồ sơ chó thất bại");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tạo hồ sơ chó");
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (activeTab === "breed") {
      setActiveTab("info");
    } else {
      handleSubmit();
    }
  };

  const renderBreedSelection = () => (
    <div className="grid grid-cols-2 gap-4">
      {dogBreeds.map((breed) => (
        <button
          key={breed.id}
          onClick={() => handleBreedSelect(breed.id)}
          className={`bg-white rounded-lg shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl ${
            selectedBreed === breed.id
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">{breed.image}</div>
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {breed.name}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );

  const renderInfoForm = () => (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin cơ bản
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thú cưng
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nhập tên thú cưng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới tính
            </label>
            <select
              value={formData.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Đực</option>
              <option value="FEMALE">Cái</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Nhập ghi chú về thú cưng..."
            />
          </div>
        </div>
      </div>
    </div>
  );

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
        <h1 className="text-center text-3xl font-bold text-green-600 mb-2">
          Tạo hồ sơ
        </h1>
        <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("breed")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "breed"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-green-500 text-white"
            }`}
          >
            Chọn loài
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              activeTab === "info"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-green-500 text-white"
            }`}
          >
            Thông tin
          </button>
        </div>

        {/* Content */}
        {activeTab === "breed" && renderBreedSelection()}
        {activeTab === "info" && renderInfoForm()}

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            disabled={saving}
            className={`w-full text-white text-lg font-bold py-4 rounded-lg shadow-lg transition duration-300 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </div>
            ) : activeTab === "breed" ? (
              "Tiếp theo"
            ) : (
              "Hoàn thành"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDogProfile;
