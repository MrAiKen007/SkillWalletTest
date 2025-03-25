import React, { useState, useEffect } from "react";
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon } from "lucide-react";
import api from "../../services/api";

const chartImages = [
  "chart.png",
  "chart-2.png",
  "chart-3.png",
  "chart-4.png",
  "chart-5.png",
  "chart-6.png",
  "chart-7.png",
  "chart-8.png",
  "chart-9.png",
  "chart-10.png",
  "chart-11.png",
  "chart-12.png",
];

const StockItem = ({ stock, chartIndex }) => {
  const getChangeColor = () => {
    if (stock.changeColor) return stock.changeColor;
    return stock.change > 0 ? "#1ac4bb" : "#dc143c";
  };

  return (
    <div className="flex items-center w-full mb-6">
      {/* Logo */}
      <div className="w-12 h-12">
        <img
          src={stock.logo}
          alt={`${stock.ticker} logo`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Informações do token */}
      <div className="ml-4 flex flex-col">
        <span className="text-[16px] font-semibold text-[#343b3a]">
          {stock.ticker}
        </span>
        <span className="text-[12px] text-gray-500">{stock.company}</span>
      </div>
      {/* Gráfico de preço */}
      <div className="flex-1 flex justify-center">
        <img
          src={chartImages[chartIndex]}
          alt="Price chart"
          className="w-[81px] h-[33px] object-cover"
        />
      </div>
      {/* Preço e variação */}
      <div className="flex flex-col items-end">
        <span className="text-[14px] font-medium text-[#343b3a]">
          {stock.price}
        </span>
        <div className="flex items-center gap-1 mt-1">
          {stock.change > 0 ? (
            <ArrowUpIcon className="w-3 h-3" color="#1ac4bb" />
          ) : (
            <ArrowDownIcon className="w-3 h-3" color={getChangeColor()} />
          )}
          <span className="text-[12px]" style={{ color: getChangeColor() }}>
            {stock.change}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Acoes() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const response = await api.get("tokens/list/");
        // Supondo que a API retorne um array de tokens
        setStocks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tokens:", error);
      }
    }
    fetchStocks();
  }, []);

  return (
    <div className="bg-[#f9f2df] flex justify-center w-full min-h-screen">
      <div className="bg-[#f9f2df] w-full max-w-[428px] h-full relative overflow-hidden">
        {/* Botão de voltar */}
        <button
          className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#dc143ccc] hover:bg-[#dc143cdd] flex items-center justify-center"
          onClick={() => window.history.back()}
        >
          <ChevronLeftIcon className="w-4 h-4 text-white" />
        </button>

        {/* Cabeçalho */}
        <div className="mt-20 px-4">
          <h2 className="text-[16px] font-semibold text-[#343b3a]">Ação</h2>
        </div>

        {/* Lista de tokens */}
        <div className="mt-4 px-4">
          {stocks.length > 0 ? (
            <div className="space-y-6">
              {stocks.map((stock, index) => (
                <StockItem
                  key={stock.id}
                  stock={stock}
                  chartIndex={index % chartImages.length}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhum token disponível</p>
          )}
        </div>
      </div>
    </div>
  );
}
