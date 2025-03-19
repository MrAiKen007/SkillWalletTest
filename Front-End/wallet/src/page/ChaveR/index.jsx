import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import BotaoCont from "../../components/Botao/BotaoCont";

export default function Chave() {
  const navigate = useNavigate();
  const location = useLocation();
  const [seedWords, setSeedWords] = useState([]);

  useEffect(() => {
    const seedKey = location.state?.seedKey || "";
    if (seedKey) {
      const wordsArray = seedKey.trim().split(" ");
      setSeedWords(wordsArray);
    }
  }, [location.state]);

  if (seedWords.length === 0) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-[#f9f2df] px-4 py-6">
        <div className="text-center text-[#343b3a] font-bold">
          Nenhuma seed encontrada. Volte e faça o registro novamente.
        </div>
      </div>
    );
  }

  const leftColumnWords = seedWords.slice(0, 12);
  const rightColumnWords = seedWords.slice(12);

  const handleCopySeed = () => {
    const seedPhrase = seedWords.join(" ");
    navigator.clipboard.writeText(seedPhrase)
      .then(() => alert("Seed phrase copiada para a área de transferência!"))
      .catch(() => alert("Erro ao copiar a seed phrase"));
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#f9f2df] px-4 py-6">
      <div className="relative w-full max-w-xl sm:max-w-2xl bg-[#f9f2df] px-6 sm:px-8 py-10 flex flex-col items-center rounded-lg shadow-md">
        {/* Botão Voltar */}
        <button
          className="absolute top-5 left-5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#dc143c] hover:bg-[#c01236] flex items-center justify-center"
          onClick={() => navigate("/registra")}
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-[#f9f2df]" />
        </button>

        {/* Ícone de Aviso */}
        <div className="flex justify-center mt-10">
          <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-[#dc143c]" />
        </div>

        {/* Texto de Aviso */}
        <div className="mt-4 text-center text-sm sm:text-lg font-black text-[#343b3a] leading-relaxed px-4">
          Guarde essas palavras em um local seguro e nunca compartilhe com ninguém.
        </div>

        {/* Título */}
        <div className="mt-6 text-center text-base sm:text-xl font-black text-[#dc143c]">
          Sua Seed Phrase
        </div>

        {/* Seed Phrase */}
        <div className="mt-6 w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 w-full max-w-xs sm:max-w-lg text-center">
            {/* Coluna Esquerda */}
            <div className="flex flex-col space-y-2 text-sm sm:text-lg font-semibold text-[#343b3a]">
              {leftColumnWords.map((word, index) => (
                <div key={`left-${index}`} className="tracking-wide">
                  {index + 1}. {word}
                </div>
              ))}
            </div>
            {/* Coluna Direita */}
            <div className="flex flex-col space-y-2 text-sm sm:text-lg font-semibold text-[#343b3a]">
              {rightColumnWords.map((word, index) => (
                <div key={`right-${index}`} className="tracking-wide">
                  {index + 13}. {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botão Copiar Seed */}
        <div className="mt-6 w-full flex justify-center">
          <button 
            className="w-full max-w-[240px] sm:max-w-[260px] h-10 sm:h-12 bg-[#343b3a] hover:bg-[#222] rounded-md font-semibold text-[#f9f2df] text-sm tracking-widest"
            onClick={handleCopySeed}
          >
            Copiar Seed
          </button>
        </div>

        {/* Botão Continuar */}
        <div className="w-full max-w-[280px] sm:max-w-[317px] mt-4 flex justify-center">
          <BotaoCont
            className="w-full h-12 sm:h-14 bg-[#dc143c] hover:bg-[#c01236] rounded-md font-semibold text-[#f9f2df] text-sm sm:text-lg tracking-widest"
            onClick={() => navigate("/chave_semente_registra_confirmado")}
          >
            Continuar
          </BotaoCont>
        </div>
      </div>
    </div>
  );
}
