import React from "react";

function PetProfile({ onNavigate, onBack }) {
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

          <div className="text-white font-bold text-xl">PETFIT</div>

          <div className="w-10"></div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-gray-100 p-6">
        <div className="flex items-center space-x-6 mb-6">
          {/* Pet Picture */}
          <div className="relative">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-green-600 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          </div>

          {/* Pet Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Golden Retriever
            </h1>
            <p className="text-gray-600 mb-4">Chó cảnh • 2 tuổi • Đực</p>

            {/* Stats */}
            <div className="flex space-x-6 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">15</div>
                <div className="text-sm text-gray-600">kg</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">3</div>
                <div className="text-sm text-gray-600">lần tiêm</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">2</div>
                <div className="text-sm text-gray-600">lần khám</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => onNavigate("booking")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Đặt lịch</span>
              </button>
              <button
                onClick={() => onNavigate("edit-pet-profile")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
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
            </div>
          </div>
        </div>

        {/* Pet Details */}
        <div className="space-y-6">
          {/* Health Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin sức khỏe
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-green-600">Khỏe mạnh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cân nặng:</span>
                  <span className="font-medium">15 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiêm chủng:</span>
                  <span className="font-medium text-green-600">Đầy đủ</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lần khám cuối:</span>
                  <span className="font-medium">15/01/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lần tiêm cuối:</span>
                  <span className="font-medium">10/01/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bác sĩ:</span>
                  <span className="font-medium">BS. Nguyễn Văn B</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hoạt động gần đây
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Khám định kỳ</div>
                  <div className="text-sm text-gray-600">
                    15/01/2024 - Phòng khám ABC
                  </div>
                </div>
                <div className="text-green-600 font-medium">Hoàn thành</div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Tiêm phòng</div>
                  <div className="text-sm text-gray-600">
                    10/01/2024 - Phòng khám ABC
                  </div>
                </div>
                <div className="text-green-600 font-medium">Hoàn thành</div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Đặt lịch khám</div>
                  <div className="text-sm text-gray-600">
                    25/01/2024 - Phòng khám ABC
                  </div>
                </div>
                <div className="text-yellow-600 font-medium">Đang chờ</div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hình ảnh
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
