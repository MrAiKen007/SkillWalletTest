import Menu from '../../components/Menu/Menu';
import { ArrowDownToLine, RefreshCw, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WalletPage() {
  const navigate = useNavigate();

  // Saldo principal (exibido no cabeçalho)
  const [balance, setBalance] = useState("Carregando...");

  // Lista de criptos (incluindo PLC)
  const [cryptoData, setCryptoData] = useState([
    {
      id: 1,
      name: "TON",
      icon: "/img/ton.png",
      localAmount: "KZ 3.600",
      amount: "555,55",
      totalValue: "KZ 2.000.000"
    },
    {
      id: 2,
      name: "USDC",
      icon: "/img/usdc.png",
      localAmount: "KZ 900",
      amount: "2.222,22",
      totalValue: "KZ 2.000.000"
    },
    {
      id: 3,
      name: "PLC",
      icon: "/img/plc.png",
      // valores provisórios (serão substituídos pelo back-end)
      localAmount: "KZ 1",
      amount: "0", 
      totalValue: "KZ 0"
    }
  ]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setBalance("Nenhum token encontrado. Faça login novamente.");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/wallet/balance/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar saldo: ${response.status}`);
        }

        const data = await response.json();
        
        // 1) Atualiza o saldo principal do cabeçalho
        setBalance(`PLC ${data.balance}`);

        // 2) Atualiza o PLC dentro do array cryptoData
        setCryptoData((prevData) =>
          prevData.map((crypto) => {
            if (crypto.name === "PLC") {
              // Ex.: substitui 'amount' pelo valor real do back-end
              return {
                ...crypto,
                amount: data.balance,         // valor do PLC
                // Se quiser atualizar localAmount ou totalValue
                // localAmount: `KZ ${data.balance}`,
                // totalValue: `KZ ${algumCálculo}`
              };
            }
            return crypto;
          })
        );
      } catch (error) {
        console.error("Erro ao carregar saldo:", error);
        setBalance("Erro ao carregar saldo");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-[#f9f2df] flex justify-center min-h-screen w-full px-6">
      <div className="w-full max-w-md">
        {/* Cabeçalho Responsivo */}
        <div className="w-full bg-[#dc143c] rounded-b-3xl text-white text-center py-10 px-4">
          <span className="text-sm opacity-75">Your Balance</span>
          <h1 className="text-3xl font-semibold mt-2">{balance}</h1>

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
            
            <button 
              onClick={() => navigate("/trocar")}
              className="flex flex-col items-center text-white"
            >
              <RefreshCw className="h-6 w-6" />
              <span className="text-xs mt-1">Trocar</span>
            </button>
          </div>
        </div>

        {/* Lista de criptomoedas */}
        <div className="mt-10 px-4">
          {cryptoData.map((crypto) => (
            <div key={crypto.id} className="flex items-center bg-white p-4 rounded-lg shadow mb-3">
              <img
                src={crypto.icon}
                alt={crypto.name}
                className="w-10 h-10 rounded-full"
              />
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
