import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  Send,
  Download,
} from "lucide-react";
import api from "../../services/api";
import Menu from "../../components/Menu/Menu";
import { Link } from "react-router-dom";

/**
 * Tela de Investimento
 * - Exibe saldo de investimento, botões para Depósito e Saque e listas de tokens
 */
export default function Investimento() {
  // Estados de dados
  const [portfolioData, setPortfolioData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [balance, setBalance] = useState("0.00");

  // Estados para os formulários de depósito e saque
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [amount, setAmount] = useState("");

  // Carregar dados da API ao montar o componente
  useEffect(() => {
    fetchPortfolio();
    fetchStocks();
    fetchBalance();
  }, []);

  // Busca lista de tokens (portfolio) em /tokens/list/
  async function fetchPortfolio() {
    try {
      const response = await api.get("tokens/list/");
      // Supondo que a API retorne um array de objetos
      setPortfolioData(response.data);
    } catch (error) {
      console.error("Erro ao buscar portfolio:", error);
    }
  }

  // Busca lista de tokens (stock data) em /tokens/list/
  async function fetchStocks() {
    try {
      const response = await api.get("tokens/list/");
      setStockData(response.data);
    } catch (error) {
      console.error("Erro ao buscar stock data:", error);
    }
  }

  // Busca saldo de investimento em /investment/balance/
  async function fetchBalance() {
    try {
      const response = await api.get("investment/balance/");
      if (response.data.balance) {
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  }

  // Função de Depósito em /investment/deposit/
  async function handleDeposit() {
    try {
      const response = await api.post("investment/deposit/", { amount });
      alert(response.data.message);
      fetchBalance();
      setAmount("");
      setShowDepositForm(false);
    } catch (error) {
      console.error("Erro ao depositar:", error);
      alert(error.response?.data?.error || "Erro ao depositar.");
    }
  }

  // Função de Saque em /investment/withdraw/
  async function handleWithdraw() {
    try {
      const response = await api.post("investment/withdraw/", { amount });
      alert(response.data.message);
      fetchBalance();
      setAmount("");
      setShowWithdrawForm(false);
    } catch (error) {
      console.error("Erro ao sacar:", error);
      alert(error.response?.data?.error || "Erro ao sacar.");
    }
  }

  return (
    <div className="bg-[#f9f2df] min-h-screen w-full flex flex-col">
      {/* Container principal, centralizado */}
      <div className="max-w-md w-full mx-auto px-4 py-6 flex-1 relative">
        {/* Seção de Saldo e Gráfico */}
        <div className="bg-[#f9f2df33] rounded-lg p-4 mb-6">
          <p className="text-sm text-[#343b3a] font-bold mb-1">Saldo</p>
          <h2 className="text-2xl font-semibold text-[#343b3a]">
            PLC {balance}
          </h2>
          <div className="flex justify-between items-center mt-4">
            <button className="inline-flex items-center bg-[#343b3a1a] rounded-md px-3 py-2 opacity-80 text-sm text-[#343b3a]">
              Esta semana
            </button>
          </div>
          <div className="relative mt-4 h-24 bg-transparent w-full">
            <img
              src="chart.png"
              alt="Chart"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-[30%] left-[50%] w-3 h-3 rounded-full bg-[#dc143c] border-2 border-white" />
          </div>
        </div>

        {/* Botões de Depósito e Saque */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <button
            className="w-14 h-14 bg-[#1ac4bbcc] rounded-full flex items-center justify-center"
            onClick={() => {
              setShowDepositForm(true);
              setShowWithdrawForm(false);
            }}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
          <button
            className="w-14 h-14 bg-[#dc143ccc] rounded-full flex items-center justify-center"
            onClick={() => {
              setShowWithdrawForm(true);
              setShowDepositForm(false);
            }}
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Formulário de Depósito */}
        {showDepositForm && (
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-72 bg-white border border-gray-300 rounded-lg p-4 z-10">
            <h3 className="text-lg font-semibold text-[#343b3a] mb-2">
              Depositar no Investimento
            </h3>
            <input
              type="number"
              placeholder="Digite o valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-[#1ac4bb] text-white px-4 py-2 rounded"
                onClick={handleDeposit}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-300 text-[#343b3a] px-4 py-2 rounded"
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

        {/* Formulário de Saque */}
        {showWithdrawForm && (
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-72 bg-white border border-gray-300 rounded-lg p-4 z-10">
            <h3 className="text-lg font-semibold text-[#343b3a] mb-2">
              Enviar para Wallet
            </h3>
            <input
              type="number"
              placeholder="Digite o valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-[#dc143c] text-white px-4 py-2 rounded"
                onClick={handleWithdraw}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-300 text-[#343b3a] px-4 py-2 rounded"
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
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-[#343b3a]">Portfolio</h3>
            <button className="text-[#dc143c] text-sm font-semibold">
              View all
            </button>
          </div>
          {portfolioData && portfolioData.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {portfolioData.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="w-40 h-24 bg-[#343b3a1a] rounded-md p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.symbol}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#343b3a]">
                        {item.symbol}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#343b3a]">
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
                            ? "text-[#1ac4bb] text-xs"
                            : item.trend === "down"
                            ? "text-[#dc143c] text-xs"
                            : "text-gray-500 text-xs"
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
            <p className="text-sm text-gray-500">Nenhum portfolio disponível</p>
          )}
        </div>

        {/* Seção de Ação (Stocks) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-[#343b3a]">Ação</h3>
            <Link to="/tokenlist" className="text-[#343b3a] text-sm">
              Ver mais
            </Link>
          </div>
          {stockData && stockData.length > 0 ? (
            <div className="flex flex-col gap-4">
              {stockData.slice(0, 4).map((stock) => (
                <div key={stock.id} className="flex items-center">
                  <img
                    src={stock.image}
                    alt={stock.symbol}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-semibold text-[#343b3a]">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-gray-500">{stock.name}</div>
                  </div>
                  <img
                    src={stock.chartImage || "chart.png"}
                    alt="Mini chart"
                    className="w-14 h-8 object-cover mr-2"
                  />
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-[#343b3a]">
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
                            ? "text-[#1ac4bb] text-xs"
                            : stock.trend === "down"
                            ? "text-[#dc143c] text-xs"
                            : "text-gray-500 text-xs"
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
            <p className="text-sm text-gray-500">Nenhum stock disponível</p>
          )}
        </div>
      </div>

      {/* MENU FIXO NO RODAPÉ */}
      <Menu activePage="chart" />
    </div>
  );
}
