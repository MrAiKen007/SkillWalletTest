import { X, Download, CreditCard } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Receber() {
  const navigate = useNavigate(); // Hook para navegação


  const options = [
    {
      id: 1,
      title: "Receber",
      icon: <Download className="w-6 h-6 text-[#343b3a]" />,
      route: "/endereco", // Rota para a página de endereço
    },
    {
      id: 2,
      title: "Banco",
      icon: <CreditCard className="w-6 h-6 text-[#343b3a]" />,
      route: "/depositar", // Rota para a página de depósito
    },
  ];

  return (
    <div className="bg-[#f9f2df] flex justify-center items-center w-full min-h-screen p-4">
      <div className="bg-[#f9f2df] w-full max-w-[428px] h-auto min-h-[600px] rounded-[25px] shadow-lg p-6 relative flex flex-col items-center">
        
        {/* Botão de fechar que leva para a Wallet */}
        <button 
          onClick={() => navigate("/wallet")} 
          className="absolute top-4 right-4 w-[40px] h-[40px] rounded-full bg-[#dc143c] flex items-center justify-center hover:bg-[#dc143c]/90"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Opções de recebimento */}
        <div className="w-full mt-16 space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => navigate(option.route)} // Navega para a respectiva rota
              className="flex items-center bg-[#d3cbb6] w-full h-[70px] rounded-[10px] p-4 cursor-pointer hover:bg-[#c4b8a5] transition"
            >
              <div className="mr-4">{option.icon}</div>
              <span className="text-[#343b3a] text-lg font-medium">{option.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
