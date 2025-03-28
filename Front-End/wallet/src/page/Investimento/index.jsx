import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Send, Download, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Menu from "../../components/Menu/Menu";

export default function Investimento() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [balance, setBalance] = useState("0.00");
  const [tokenSymbol, setTokenSymbol] = useState("PLC");

  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolio();
    fetchStocks();
    fetchBalance();

    const storedSymbol = localStorage.getItem("token_symbol");
    if (storedSymbol) {
      setTokenSymbol(storedSymbol);
    }
  }, []);

  async function fetchPortfolio() {
    try {
      const response = await api.get("/investimento/api/tokens/list/");
      setPortfolioData(response.data);
    } catch (error) {
      console.error("Erro ao buscar portfolio:", error);
    }
  }

  async function fetchStocks() {
    try {
      const response = await api.get("/investimento/api/tokens/list/");
      setStockData(response.data);
    } catch (error) {
      console.error("Erro ao buscar stock data:", error);
    }
  }

  async function fetchBalance() {
    try {
      const response = await api.get("/investimento/api/investment/balance/");
      if (response.data.balance) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  }

  async function handleDeposit() {
    try {
      const response = await api.post("/investimento/api/investment/deposit/", { amount });
      alert(response.data.message);
      fetchBalance();
      setAmount("");
      setShowDepositForm(false);
    } catch (error) {
      console.error("Erro ao depositar:", error);
      alert(error.response?.data?.error || "Erro ao depositar.");
    }
  }

  async function handleWithdraw() {
    try {
      const response = await api.post("/investimento/api/investment/withdraw/", { amount });
      alert(response.data.message);
      fetchBalance();
      setAmount("");
      setShowWithdrawForm(false);
    } catch (error) {
      console.error("Erro ao sacar:", error);
      alert(error.response?.data?.error || "Erro ao sacar.");
    }
  }

  function goToTokenizacao() {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      navigate(`/token/${userId}`);
    } else {
      alert("ID do usuário não encontrado.");
    }
  }

  return (
    <div className="bg-[#f9f2df] min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-4 relative">
        {/* Seção de Saldo e Gráfico */}
        <div className="bg-[#f9f2df33] rounded-lg p-3 mb-4">
          <p className="text-xs text-[#343b3a] font-bold mb-1">Saldo</p>
          <h2 className="text-xl font-semibold text-[#343b3a]">
            {tokenSymbol} {balance}
          </h2>
          <div className="flex justify-between items-center mt-3">
            <button className="inline-flex items-center bg-[#343b3a1a] rounded-md px-2 py-1 opacity-80 text-xs text-[#343b3a]">
              Esta semana
            </button>
          </div>
          <div className="relative mt-3 h-20 bg-transparent w-full">
            <img
              src="chart.png"
              alt="Chart"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-[30%] left-[50%] w-2 h-2 rounded-full bg-[#dc143c] border-2 border-white" />
          </div>
        </div>

        {/* Botões (Depósito, Saque, Tokenização) */}
        <div className="flex justify-center items-center gap-4 mb-4">
          {/* Reduzi de w-14 h-14 para w-10 h-10 */}
          <button
            className="w-10 h-10 bg-[#1ac4bbcc] rounded-full flex items-center justify-center"
            onClick={() => {
              setShowDepositForm(true);
              setShowWithdrawForm(false);
            }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
          <button
            className="w-10 h-10 bg-[#dc143ccc] rounded-full flex items-center justify-center"
            onClick={() => {
              setShowWithdrawForm(true);
              setShowDepositForm(false);
            }}
          >
            <Download className="w-4 h-4 text-white" />
          </button>
          <button
            className="w-10 h-10 bg-[#8a2be2] rounded-full flex items-center justify-center"
            onClick={goToTokenizacao}
          >
            <Tag className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Formulário Depósito */}
        {showDepositForm && (
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-64 bg-white border border-gray-300 rounded-lg p-3 z-50">
            <h3 className="text-sm font-semibold text-[#343b3a] mb-2">
              Depositar no Investimento
            </h3>
            <input
              type="number"
              placeholder="Digite o valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-1 mb-2 border border-gray-300 rounded text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-[#1ac4bb] text-white px-3 py-1 rounded text-sm"
                onClick={handleDeposit}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-300 text-[#343b3a] px-3 py-1 rounded text-sm"
                onClick={() => {
                  setShowDepositForm(false);
                  setAmount("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Formulário Saque */}
        {showWithdrawForm && (
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-64 bg-white border border-gray-300 rounded-lg p-3 z-50">
            <h3 className="text-sm font-semibold text-[#343b3a] mb-2">
              Enviar para Wallet
            </h3>
            <input
              type="number"
              placeholder="Digite o valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-1 mb-2 border border-gray-300 rounded text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-[#dc143c] text-white px-3 py-1 rounded text-sm"
                onClick={handleWithdraw}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-300 text-[#343b3a] px-3 py-1 rounded text-sm"
                onClick={() => {
                  setShowWithdrawForm(false);
                  setAmount("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Seção de Portfolio */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-bold text-[#343b3a]">Portfolio</h3>
            <button className="text-[#dc143c] text-xs font-semibold">
              View all
            </button>
          </div>
          {portfolioData && portfolioData.length > 0 ? (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {portfolioData.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="w-36 h-20 bg-[#343b3a1a] rounded-md p-2 flex flex-col justify-between cursor-pointer"
                  onClick={() => navigate(`/tokenview/${item.id}`)}
                >
                  <div className="flex items-center gap-1">
                    <img
                      src={item.image}
                      alt={item.symbol}
                      className="w-6 h-6 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#343b3a]">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#343b3a]">
                      {item.price}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.trend === "up" ? (
                        <ArrowUp className="w-3 h-3 text-[#1ac4bb]" />
                      ) : item.trend === "down" ? (
                        <ArrowDown className="w-3 h-3 text-[#dc143c]" />
                      ) : null}
                      <span
                        className={
                          item.trend === "up"
                            ? "text-[#1ac4bb] text-[10px]"
                            : item.trend === "down"
                            ? "text-[#dc143c] text-[10px]"
                            : "text-gray-500 text-[10px]"
                        }
                      >
                        {item.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Nenhum portfolio disponível</p>
          )}
        </div>

        {/* Seção de Ação (Stocks) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-bold text-[#343b3a]">Ação</h3>
            <Link to="/tokenlist" className="text-[#343b3a] text-xs">
              Ver mais
            </Link>
          </div>
          {stockData && stockData.length > 0 ? (
            <div className="flex flex-col gap-3">
              {stockData.slice(0, 4).map((stock) => (
                <div
                  key={stock.id}
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate(`/tokenview/${stock.id}`)}
                >
                  <img
                    src={stock.image}
                    alt={stock.symbol}
                    className="w-8 h-8 object-cover rounded-md"
                  />
                  <div className="ml-2 flex-1">
                    <div className="text-xs font-semibold text-[#343b3a]">
                      {stock.symbol}
                    </div>
                    <div className="text-[10px] text-gray-500">{stock.name}</div>
                  </div>
                  <img
                    src={stock.chartImage || "chart.png"}
                    alt="Mini chart"
                    className="w-12 h-6 object-cover mr-1"
                  />
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-[#343b3a]">
                      {stock.price}
                    </span>
                    <div className="flex items-center gap-1">
                      {stock.trend === "up" ? (
                        <ArrowUp className="w-3 h-3 text-[#1ac4bb]" />
                      ) : stock.trend === "down" ? (
                        <ArrowDown className="w-3 h-3 text-[#dc143c]" />
                      ) : null}
                      <span
                        className={
                          stock.trend === "up"
                            ? "text-[#1ac4bb] text-[10px]"
                            : stock.trend === "down"
                            ? "text-[#dc143c] text-[10px]"
                            : "text-gray-500 text-[10px]"
                        }
                      >
                        {stock.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Nenhum stock disponível</p>
          )}
        </div>
      </div>

      <Menu activePage="chart" />
    </div>
  );
}