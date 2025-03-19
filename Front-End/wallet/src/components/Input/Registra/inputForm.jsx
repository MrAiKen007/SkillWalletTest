import React from "react";

export default function InputForm({ id, type, value, onChange, placeholder, className }) {
  return (
    <div className="w-full max-w-[393px]">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-[#343b3a33] rounded-[15px] border-none h-[59px] px-4 text-[#343b3a] w-full ${className}`}
      />
    </div>
  );
}

