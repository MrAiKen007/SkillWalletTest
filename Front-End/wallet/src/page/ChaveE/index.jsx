import BotaoCont from '../../components/Botao/BotaoCont';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChaveConfirmar() {
  const [texto, setTexto] = useState("");
  const [focus, setFocus] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="bg-[#f9f2df] min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Caixa dos Inputs */}
        <section className="w-full bg-[#d1cbb8] rounded-lg p-6 shadow-md">
          <h2 className="text-[#343b3a] text-center font-medium text-lg mb-4">
            Digita as chaves
          </h2>
          <div className="relative w-full">
            <textarea
              className="w-full h-40 bg-transparent border-none text-[#343b3a] text-center text-base resize-none focus:outline-none"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(texto.length > 0)}
            />
            {!focus && texto.length === 0 && (
              <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm pointer-events-none">
                Digite sua seed phrase aqui...
              </span>
            )}
          </div>
        </section>

        {/* Botão de Continuar */}
        <footer className="mt-8 w-full flex justify-center">
          <BotaoCont
            className="w-[80%] max-w-[300px] h-14 bg-[#d91c5c] hover:bg-[#c01951] text-white rounded-full font-semibold text-lg flex items-center justify-center"
            onClick={() => {
              console.log("Redirecionando para /chave_semente_entra_confirmado");
              navigate("/chave_semente_entra_confirmado");
            }}
          >
            Continuar
          </BotaoCont>
        </footer>

      </div>
    </main>
  );
}

