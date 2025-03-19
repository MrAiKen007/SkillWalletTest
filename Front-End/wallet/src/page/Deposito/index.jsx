import { X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../../components/Input/Registra/inputForm";
import BotaoCont from "../../components/Botao/BotaoCont";

export default function Deposito() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#f9f2df] p-4">
      <div className="relative w-full max-w-[428px] h-auto min-h-[600px] bg-[#f9f2df] rounded-2xl shadow-lg p-6">
        {/* Botão de fechar - Redireciona para a wallet */}
        <button
          onClick={() => navigate("/wallet")}
          className="absolute top-5 right-5 w-[45px] h-[45px] rounded-full bg-[#dc143c] hover:bg-[#dc143c]/90 flex items-center justify-center"
        >
          <X className="w-[30px] h-[30px] text-white" />
        </button>

        {/* InputForm com placeholder "Depositar" e restrição para números */}
        <div className="mt-20">
          <InputForm placeholder="Depositar" type="number" className="w-full" />
        </div>

        {/* Botão que leva o usuário para a wallet */}
        <div className="mt-6 flex justify-center">
          <BotaoCont onClick={() => navigate("/wallet")} />
        </div>
      </div>
    </div>
  );
}
