import React from "react";

export default function Box({ onClick, children }) {
  return (
    <button
      className="w-[315px] h-16 rounded-full bg-[#E01533] border-0 flex items-center justify-center text-white font-poppins text-lg font-semibold hover:bg-[#c01236] active:scale-95 transition-all"
      onClick={onClick}
    >
      {children || "Continuar"}
    </button>
  );
}
