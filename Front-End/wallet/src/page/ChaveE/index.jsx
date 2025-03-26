import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BotaoCont from "../../components/Botao/BotaoCont";
import { ChevronLeft } from "lucide-react";

export default function ChaveConfirmar() {
  const [seedInput, setSeedInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera a seed recebida via login (location.state.seedKey)
  const seedFromLogin = location.state?.seedKey || "";

  const handleConfirmSeed = () => {
    if (seedInput.trim() === seedFromLogin.trim()) {
      navigate("/chave_semente_entra_confirmado");
    } else {
      setErrorMessage("Seed incorreta. Por favor, verifique e tente novamente.");
    }
  };

  return (
    <main className="bg-[#f9f2df] min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Botão Voltar */}
      <button
        className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-[#dc143c] hover:bg-[#c01236]"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      <div className="w-full max-w-md flex flex-col items-center">
        {/* Caixa do Input */}
        <section className="w-full bg-[#d1cbb8] rounded-lg p-6 shadow-md">
          <h2 className="text-[#343b3a] text-center font-medium text-lg mb-4">
            Digite sua seed phrase:
          </h2>
          <input
            type="text"
            placeholder="Digite sua seed phrase aqui..."
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            autoFocus
            className="w-full h-12 bg-transparent border border-gray-300 rounded-lg text-[#343b3a] text-base text-center px-4 focus:outline-none"
          />
        </section>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <p className="mt-4 text-red-600 text-sm text-center">
            {errorMessage}
          </p>
        )}

        {/* Botão de Confirmar */}
        <footer className="mt-8 w-full flex justify-center">
          <BotaoCont
            className="w-[80%] max-w-[300px] h-14 bg-[#d91c5c] hover:bg-[#c01951] text-white rounded-full font-semibold text-lg flex items-center justify-center"
            onClick={handleConfirmSeed}
          >
            Confirmar
          </BotaoCont>
        </footer>
      </div>
    </main>
  );
}
