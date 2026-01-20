import React, { useState, useEffect } from "react";
import { profileAPI } from "../services/api";

function PetDetail({ onNavigate, onBack, petId }) {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (petId) {
      loadPetData();
    }
  }, [petId]);

  const loadPetData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy danh sách thú cưng và tìm thú cưng theo ID
      const result = await profileAPI.getPets();
      if (result.success) {
        const pets = result.data?.content || result.data || [];
        const foundPet = pets.find((p) => p.id === parseInt(petId));
        if (foundPet) {
          setPet(foundPet);
        } else {
          setError("Không tìm thấy thú cưng");
        }
      } else {
        setError(result.error || "Không thể tải thông tin thú cưng");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải thông tin thú cưng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thú cưng này?")) {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    }
  };

  const getPetIcon = (type) => {
    return type === "DOG" ? "🐕" : "🐱";
  };

  const getPetTypeText = (type) => {
    return type === "DOG" ? "Chó" : "Mèo";
  };

  const getSexText = (sex) => {
    return sex === "MALE" ? "Đực" : "Cái";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const calculateAge = (dob) => {
    if (!dob) return "Chưa xác định";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age > 0 ? `${age} tuổi` : "Dưới 1 tuổi";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin thú cưng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadPetData}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
          >
            Thử lại
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-6xl mb-4">🐾</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Không tìm thấy thú cưng
          </h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Quay lại
          </button>
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
            <span>Hồ sơ thú cưng</span>
            <div className="ml-1 w-2 h-2 bg-white rounded-full"></div>
          </div>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Pet Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">{getPetIcon(pet.type)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
              <p className="text-gray-600">
                {getPetTypeText(pet.type)} • {pet.breed}
              </p>
              <p className="text-sm text-gray-500">
                Thêm ngày: {formatDate(pet.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  onNavigate("edit-pet-profile", { petId: pet.id })
                }
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pet Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Tên</span>
                <span className="text-gray-800">{pet.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Loài</span>
                <span className="text-gray-800">
                  {getPetTypeText(pet.type)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Giống</span>
                <span className="text-gray-800">
                  {pet.breed || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Giới tính</span>
                <span className="text-gray-800">
                  {pet.sex ? getSexText(pet.sex) : "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Ngày sinh</span>
                <span className="text-gray-800">{formatDate(pet.dob)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Tuổi</span>
                <span className="text-gray-800">{calculateAge(pet.dob)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ghi chú
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
              {pet.notes ? (
                <p className="text-gray-700 whitespace-pre-wrap">{pet.notes}</p>
              ) : (
                <p className="text-gray-500 italic">Chưa có ghi chú nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate("edit-pet-profile", { petId: pet.id })}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>Chỉnh sửa thông tin</span>
            </button>

            <button
              onClick={() => {
                // Navigate to booking with pet selected
                alert("Chức năng đặt lịch sẽ được phát triển");
              }}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Đặt lịch dịch vụ</span>
            </button>

            <button
              onClick={() => {
                // Navigate to medical history
                alert("Chức năng lịch sử y tế sẽ được phát triển");
              }}
              className="flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Lịch sử y tế</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetail;
