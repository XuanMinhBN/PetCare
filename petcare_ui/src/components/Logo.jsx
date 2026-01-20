import React from "react";

function Logo() {
  return (
    <div className="flex flex-col items-center select-none">
      <div className="text-6xl sm:text-7xl font-extrabold tracking-wider text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]">
        PETFIT
      </div>
      <div className="-mt-10 mb-6">
        <svg
          width="42"
          height="42"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="18" r="8" fill="#fff" />
          <circle cx="44" cy="18" r="8" fill="#fff" />
          <circle cx="30" cy="8" r="6" fill="#fff" />
          <circle cx="34" cy="30" r="10" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

export default Logo;
