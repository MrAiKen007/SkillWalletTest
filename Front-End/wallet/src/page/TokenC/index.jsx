import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TokenizacaoForm() {
  const navigate = useNavigate();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback("");
    const data = {
      token_name: tokenName,
      token_symbol: tokenSymbol,
      token_price: tokenPrice,
      token_quantity: tokenQuantity,
    };
    try {
      const response = await api.post("/investimento/api/tokenization/configure/", data);
      setFeedback(response.data.message || "Pedido enviado com sucesso!");

      setTokenName("");
      setTokenSymbol("");
      setTokenPrice("");
      setTokenQuantity("");
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      setFeedback(
        error.response?.data?.error || "Erro ao enviar pedido de tokenização."
      );
    }
  }

  return (
    <div className="bg-[#f9f2df] min-h-screen w-full flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold text-[#343b3a] mb-4">
          Solicitar Tokenização
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#343b3a] mb-1">
              Nome do Token
            </label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#343b3a] mb-1">
              Símbolo do Token
            </label>
            <input
              type="text"
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#343b3a] mb-1">
              Preço Inicial
            </label>
            <input
              type="number"
              step="0.01"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#343b3a] mb-1">
              Quantidade (Supply)
            </label>
            <input
              type="number"
              value={tokenQuantity}
              onChange={(e) => setTokenQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1ac4bb] text-white py-2 rounded font-semibold"
          >
            Enviar Pedido
          </button>
        </form>
        {feedback && (
          <p className="mt-3 text-sm text-[#343b3a]">{feedback}</p>
        )}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-[#dc143c] underline"
      >
        Voltar
      </button>
    </div>
  );
}
