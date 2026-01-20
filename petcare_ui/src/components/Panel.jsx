import React from "react";

function Panel({ children }) {
  return (
    <div className="w-full rounded-3xl border-4 border-emerald-900/60 bg-emerald-900/30 backdrop-blur-sm p-6 sm:p-8 shadow-[0_10px_0_rgba(0,0,0,0.25)]">
      {children}
    </div>
  );
}

export default Panel;
