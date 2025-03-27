import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TokenizacaoRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [navigate]);

  async function fetchRequests() {
    try {
      const response = await api.get("/investimento/api/tokenization/requests/");
      setRequests(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }

  async function handleApprove(requestId) {
    try {
      const response = await api.post("/investimento/api/tokenization/approve/", {
        request_id: requestId,
      });
      setFeedback(response.data.message);
      fetchRequests();
    } catch (error) {
      console.error("Erro ao aprovar pedido:", error);
      setFeedback(
        error.response?.data?.error || "Erro ao aprovar o pedido."
      );
    }
  }

  async function handleReject(requestId) {
    try {
      const response = await api.post("/investimento/api/tokenization/reject/", {
        request_id: requestId,
      });
      setFeedback(response.data.message);
      fetchRequests();
    } catch (error) {
      console.error("Erro ao rejeitar pedido:", error);
      setFeedback(
        error.response?.data?.error || "Erro ao rejeitar o pedido."
      );
    }
  }

  return (
    <div className="bg-[#f9f2df] min-h-screen w-full flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold text-[#343b3a] mb-4">
          Pedidos de Tokenização
        </h1>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-600">
            Nenhum pedido pendente no momento.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-gray-100 rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-[#343b3a]">
                    {req.token_name || "Token Sem Nome"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Preço: {req.token_price} | Quantidade: {req.token_quantity}
                  </p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="bg-[#1ac4bb] text-white px-3 py-1 rounded text-sm"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="bg-[#dc143c] text-white px-3 py-1 rounded text-sm"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-[#dc143c] underline"
      >
        Voltar
      </button>
      {feedback && (
        <p className="mt-3 text-sm text-[#343b3a]">{feedback}</p>
      )}
    </div>
  );
}
