import React from "react";

export default function Box() {
  return (
    <div className="relative h-[50px] w-[50px]">
      <button
        className="absolute left-0 top-0 h-[50px] w-[50px] rounded-full p-0 bg-red-500 text-white flex items-center justify-center"
      >
      </button>
    </div>
  );
}
