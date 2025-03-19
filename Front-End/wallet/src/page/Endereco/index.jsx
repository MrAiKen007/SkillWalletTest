import { Copy, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Endereco() {
  const navigate = useNavigate();

  // Obtém o email do usuário do localStorage
  const userEmail = localStorage.getItem("userEmail") || "Email não encontrado";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userEmail);
    alert("Email copiado!");
  };

  return (
    <div className="bg-[#f9f2df] flex flex-col items-center justify-center w-full min-h-screen p-4">
      <div className="relative w-full max-w-[428px] bg-[#f9f2df] rounded-2xl shadow-lg p-6 flex flex-col items-center">
        {/* Botão de fechar - Redireciona para a wallet */}
        <button
          onClick={() => navigate("/wallet")}
          className="absolute top-5 right-5 w-[45px] h-[45px] rounded-full bg-[#dc143c] hover:bg-[#dc143c]/90 flex items-center justify-center"
        >
          <X className="w-[30px] h-[30px] text-white" />
        </button>

        {/* Título */}
        <h2 className="mt-10 text-[#dc143c] text-2xl font-semibold tracking-wider text-center">
          Seu Email
        </h2>

        {/* Exibição do Email */}
        <p className="text-[#343b3a] text-sm tracking-wider text-center break-words w-[274px] mt-6">
          {userEmail}
        </p>

        {/* Botão de Copiar */}
        <button
          onClick={copyToClipboard}
          className="mt-6 flex items-center justify-center w-[120px] h-[40px] bg-[#343b3a] hover:bg-[#2a302f] rounded-full text-white font-medium tracking-wide"
        >
          Copiar
          <Copy className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
