import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import api from "../../services/api";

export default function TokenView() {
  const { token_id } = useParams();
  const navigate = useNavigate();

  const [tokenDetail, setTokenDetail] = useState({});
  const [candlestickChart, setCandlestickChart] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [selectedTab, setSelectedTab] = useState("valor");
  const [loading, setLoading] = useState(false);

  const [showBuyForm, setShowBuyForm] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState("");
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellQuantity, setSellQuantity] = useState("");

  const timePeriods = ["12H", "1D", "1W", "1M", "1Y"];

  useEffect(() => {
    if (!token_id) return;
    fetchTokenDetail(token_id);
    fetchCandlestickChart(token_id);
    if (selectedTab === "fluxo") {
      fetchTransactionHistory(token_id);
    }
  }, [token_id, selectedTab]);

  async function fetchTokenDetail(id) {
    try {
      const response = await api.get(`/investimento/api/tokens/${id}/`);
      setTokenDetail(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do token:", error);
    }
  }

  async function fetchCandlestickChart(id) {
    try {
      setLoading(true);
      const response = await api.get(`/investimento/api/tokens/${id}/candlestick/`);
      setCandlestickChart(response.data.chart_image);
    } catch (error) {
      console.error("Erro ao buscar gráfico de velas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactionHistory(id) {
    try {
      const response = await api.get(`/investimento/api/tokens/${id}/history/`);
      setTransactionHistory(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico de transações:", error);
    }
  }

  async function handleBuy() {
    if (!buyQuantity || parseInt(buyQuantity) <= 0) {
      alert("Informe uma quantidade válida para comprar.");
      return;
    }
    try {
      const response = await api.post(`/investimento/api/tokens/${token_id}/trade/`, {
        type: "buy",
        quantity: parseInt(buyQuantity),
        price: tokenDetail.price,
      });
      alert(response.data.message);
      setShowBuyForm(false);
    } catch (error) {
      console.error("Erro ao comprar:", error);
      alert(error.response?.data?.error || "Erro ao comprar.");
    }
  }

  async function handleSell() {
    if (!sellQuantity || parseInt(sellQuantity) <= 0) {
      alert("Informe uma quantidade válida para vender.");
      return;
    }
    try {
      const response = await api.post(`/investimento/api/tokens/${token_id}/trade/`, {
        type: "sell",
        quantity: parseInt(sellQuantity),
        price: tokenDetail.price,
      });
      alert(response.data.message);
      setSellQuantity("");
      setShowSellForm(false);
    } catch (error) {
      console.error("Erro ao vender:", error);
      alert(error.response?.data?.error || "Erro ao vender.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando...
      </div>
    );
  }

  const tokenNameDisplay = tokenDetail?.token_request?.token_name || "Unknown Token";
  const tokenSymbol = tokenDetail?.token_request?.token_symbol || "TKN";
  const tokenSupply = tokenDetail?.supply || 0;
  const tokenPrice = tokenDetail?.price || "0.00";
  const listedAt = tokenDetail?.listed_at || null;

  return (
    <div className="bg-[#f9f2df] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[428px] relative p-4">
        {/* Botão de voltar */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-12 h-12 bg-[#dc143c] rounded-full flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Cabeçalho: Detalhes do Token */}
        <div className="mt-20 flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <h1 className="text-2xl font-bold text-[#343b3a]">
            {tokenSymbol} <span className="text-base text-[#9e9e9e]">({tokenNameDisplay})</span>
          </h1>
        </div>

        {/* Abas */}
        <div className="mt-4 flex border-b border-gray-300 w-full">
          <button
            onClick={() => setSelectedTab("valor")}
            className={`flex-1 py-2 text-center font-medium ${
              selectedTab === "valor" ? "text-[#dc143c] border-b-2 border-[#dc143c]" : "text-[#343b3a]"
            }`}
          >
            Valor
          </button>
          <button
            onClick={() => setSelectedTab("informacao")}
            className={`flex-1 py-2 text-center font-medium ${
              selectedTab === "informacao" ? "text-[#dc143c] border-b-2 border-[#dc143c]" : "text-[#343b3a]"
            }`}
          >
            Informação
          </button>
          <button
            onClick={() => setSelectedTab("fluxo")}
            className={`flex-1 py-2 text-center font-medium ${
              selectedTab === "fluxo" ? "text-[#dc143c] border-b-2 border-[#dc143c]" : "text-[#343b3a]"
            }`}
          >
            Fluxo
          </button>
        </div>

        {/* Conteúdo da aba "Valor" */}
        {selectedTab === "valor" && (
          <div className="mt-6 text-center">
            <h2 className="text-4xl font-semibold">
              PLC {tokenPrice.split(".")[0]}
              <span className="text-2xl text-[#9e9e9e]">
                .{tokenPrice.split(".")[1] || "00"}
              </span>
            </h2>
            <p className="mt-2 text-sm text-[#343b3a]">Supply: {tokenSupply}</p>
            {listedAt && (
              <p className="text-sm text-[#343b3a]">
                Listed at: {new Date(listedAt).toLocaleString()}
              </p>
            )}

            {/* Gráfico Candlestick */}
            <div className="mt-4 mx-auto w-full h-64 border border-dashed border-gray-300 flex items-center justify-center">
              {candlestickChart ? (
                <img
                  src={`data:image/png;base64,${candlestickChart}`}
                  alt="Candlestick Chart"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">Candlestick Chart</span>
              )}
            </div>

            {/* Seletores de período */}
            <div className="mt-2 flex justify-center gap-2">
              {timePeriods.map((tp, index) => (
                <button
                  key={index}
                  className={`px-2 py-1 rounded-full text-sm ${
                    tp === "1W"
                      ? "bg-[#dc143c] text-white"
                      : "text-[#343b3a] border border-[#dc143c]"
                  }`}
                >
                  {tp}
                </button>
              ))}
            </div>

            {/* Botões de ação: Comprar e Vender */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowBuyForm(true);
                  setShowSellForm(false);
                }}
                className="w-[120px] h-[45px] bg-[#1ac4bb] rounded-[15px] text-white text-base font-medium"
              >
                Comprar
              </button>
              <button
                onClick={() => {
                  setShowSellForm(true);
                  setShowBuyForm(false);
                }}
                className="w-[120px] h-[45px] bg-[#dc143c] rounded-[15px] text-white text-base font-medium"
              >
                Vender
              </button>
            </div>

            {/* Formulário para inserir quantidade de compra */}
            {showBuyForm && (
              <div className="mt-4">
                <input
                  type="number"
                  placeholder="Quantidade para comprar"
                  value={buyQuantity}
                  onChange={(e) => setBuyQuantity(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mb-2"
                />
                <button
                  onClick={handleBuy}
                  className="w-full bg-[#1ac4bb] text-white py-2 rounded font-medium"
                >
                  Confirmar Compra
                </button>
              </div>
            )}

            {/* Formulário para inserir quantidade de venda */}
            {showSellForm && (
              <div className="mt-4">
                <input
                  type="number"
                  placeholder="Quantidade para vender"
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mb-2"
                />
                <button
                  onClick={handleSell}
                  className="w-full bg-[#dc143c] text-white py-2 rounded font-medium"
                >
                  Confirmar Venda
                </button>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo da aba "Informação" */}
        {selectedTab === "informacao" && (
          <div className="mt-6 px-4 text-[#343b3a]">
            <h3 className="text-lg font-semibold mb-2">Informações do Token</h3>
            <p className="text-sm">Nome: {tokenNameDisplay}</p>
            <p className="text-sm">Símbolo: {tokenSymbol}</p>
            <p className="text-sm">Supply: {tokenSupply}</p>
            <p className="text-sm">Preço Atual: {tokenPrice}</p>
          </div>
        )}

        {/* Conteúdo da aba "Fluxo" */}
        {selectedTab === "fluxo" && (
          <div className="mt-6 px-4">
            <h3 className="text-lg font-semibold mb-2 text-[#343b3a]">
              Histórico de Transações
            </h3>
            {transactionHistory.length > 0 ? (
              <div className="max-h-48 overflow-y-auto text-xs">
                {transactionHistory.map((trans, index) => (
                  <div key={index} className="mb-2">
                    <p>{trans.created_at}</p>
                    <p>
                      {trans.is_buy ? "Compra" : "Venda"}: {trans.quantity} @ {trans.price_per_unit}
                    </p>
                    <p>Total: {trans.total}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sem transações.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
