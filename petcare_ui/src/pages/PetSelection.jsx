import React from "react";

function PetSelection({ onNavigate, onBack }) {
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
          Hồ sơ thú cưng
        </h1>
        <div className="w-20 h-1 bg-green-600 mx-auto mb-12"></div>

        {/* Create Pet Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Dog Profile Card */}
          <button
            onClick={() => onNavigate("create-dog-profile")}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-200"
          >
            <div className="flex flex-col items-center text-center">
              {/* Dog Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Dog Label */}
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Tạo hồ sơ chó
              </h2>
              <p className="text-gray-600 text-sm">
                Tạo hồ sơ chi tiết cho chú chó của bạn
              </p>
            </div>
          </button>

          {/* Create Cat Profile Card */}
          <button
            onClick={() => onNavigate("create-cat-profile")}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-green-200"
          >
            <div className="flex flex-col items-center text-center">
              {/* Cat Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Cat Label */}
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Tạo hồ sơ mèo
              </h2>
              <p className="text-gray-600 text-sm">
                Tạo hồ sơ chi tiết cho chú mèo của bạn
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetSelection;
