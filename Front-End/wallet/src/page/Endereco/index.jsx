import { Copy, X } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Endereco() {
  const navigate = useNavigate();


  const addressData = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(addressData);
    alert("Endereço copiado!");
  };

  return (
    <div className="bg-[#f9f2df] flex flex-col items-center justify-center w-full min-h-screen p-4">
      <div className="relative w-full max-w-[428px] bg-[#f9f2df] rounded-2xl shadow-lg p-6 flex flex-col items-center">
        {/* Botão de fechar - Redireciona para a wallet */}
        <button
          onClick={() => navigate("/wallet")} // Navega para a rota da wallet
          className="absolute top-5 right-5 w-[45px] h-[45px] rounded-full bg-[#dc143c] hover:bg-[#dc143c]/90 flex items-center justify-center"
        >
          <X className="w-[30px] h-[30px] text-white" />
        </button>

        {/* Título */}
        <h2 className="mt-10 text-[#dc143c] text-2xl font-semibold tracking-wider text-center">
          Endereço
        </h2>

        {/* QR Code (adicione a URL da imagem) */}
        <img
          className="w-[250px] h-[250px] my-6"
          alt="QR Code"
          src="/path/para/qr-code.png"
        />

        {/* Endereço */}
        <p className="text-[#343b3a] text-sm tracking-wider text-center break-words w-[274px]">
          {addressData}
        </p>

        {/* Botão de copiar */}
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

