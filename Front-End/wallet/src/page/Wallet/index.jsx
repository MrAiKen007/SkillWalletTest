import Menu from '../../components/Menu/Menu';
import { ArrowDownToLine, RefreshCw, Send } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function WalletPage() {
  const navigate = useNavigate();

  
  const cryptoData = [
    { id: 1, name: "TON", icon: "/mnt/data/image.png", localAmount: "KZ 3.600", amount: "555,55", totalValue: "KZ 2.000.000" },
    { id: 2, name: "USDC", icon: "/mnt/data/image.png", localAmount: "KZ 900", amount: "2.222,22", totalValue: "KZ 2.000.000" },
    { id: 3, name: "PLC", icon: "/mnt/data/image.png", localAmount: "KZ 1", amount: "4.000.000", totalValue: "KZ 4.000.000" },
  ];

  return (
    <div className="bg-[#f9f2df] flex justify-center min-h-screen w-full px-6">
      <div className="w-full max-w-md">
        {/* Cabeçalho Responsivo */}
        <div className="w-full bg-[#dc143c] rounded-b-3xl text-white text-center py-10 px-4 md:px-6 lg:px-10 flex flex-col items-center">
          <span className="text-sm opacity-75">Your Balance</span>
          <h1 className="text-3xl font-semibold mt-2">KZ 8.000.000</h1>

          {/* Botões de ação com navegação */}
          <div className="flex justify-center gap-6 mt-6">
            <button 
              onClick={() => navigate("/enviar")}
              className="flex flex-col items-center text-white"
            >
              <Send className="h-6 w-6" />
              <span className="text-xs mt-1">Enviar</span>
            </button>
            
            <button 
              onClick={() => navigate("/receber")}
              className="flex flex-col items-center text-white"
            >
              <ArrowDownToLine className="h-6 w-6" />
              <span className="text-xs mt-1">Receber</span>
            </button>
            
            <button className="flex flex-col items-center text-white">
              <RefreshCw className="h-6 w-6" />
              <span className="text-xs mt-1">Trocar</span>
            </button>
          </div>
        </div>

        {/* Lista de criptomoedas */}
        <div className="mt-10 px-4">
          {cryptoData.map((crypto) => (
            <div key={crypto.id} className="flex items-center bg-white p-4 rounded-lg shadow mb-3">
              <img src={crypto.icon} alt={crypto.name} className="w-10 h-10 rounded-full" />
              <div className="ml-4">
                <span className="font-bold text-gray-800">{crypto.name}</span>
                <p className="text-xs text-gray-500">{crypto.localAmount}</p>
              </div>
              <div className="ml-auto text-right">
                <span className="font-bold text-gray-800">{crypto.amount}</span>
                <p className="text-xs text-gray-500">{crypto.totalValue}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Barra de navegação inferior */}
        <Menu activePage="wallet" />
      </div>
    </div>
  );
}

