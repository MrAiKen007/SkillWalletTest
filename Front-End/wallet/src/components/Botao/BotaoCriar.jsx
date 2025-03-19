import React from "react";
import BotaoCont from "./BotaoCont";

export default function Box() {
  return (
    <div className="w-[315px] h-16">
      <BotaoCont className="w-full h-16 bg-[#e01e36] hover:bg-[#c01a30] text-[#f9f2df] rounded-full font-semibold text-[15px] tracking-[2px] leading-[26px]">
        Criar
      </BotaoCont>
    </div>
  );
}
