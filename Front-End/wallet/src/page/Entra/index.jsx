import BotaoCont from '../../components/Botao/BotaoCont';
import InputForm from '../../components/Input/Registra/inputForm';
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EntraConta() {

  const [mostrarSenha, setMostrarSenha] = useState(false);


  const navigate = useNavigate(); 


  const formFields = [
    { id: "nome", label: "Nome", type: "text" },
    { id: "senha", label: "Senha", type: mostrarSenha ? "text" : "password" },
  ];

  return (
    <main className="bg-[#f9f2df] flex justify-center items-center w-full min-h-screen px-4">
      <div className="bg-[#f9f2df] w-full max-w-sm sm:max-w-md h-auto py-10 px-6 rounded-lg shadow-md relative">
        
        {/* Botão de Voltar */}
        <button
          className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-[#dc143c] hover:bg-[#c01236]"
          onClick={() => navigate("/contas")}
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </button>

        {/* Título */}
        <h1 className="mt-20 text-center font-black text-[#343b3a] text-2xl">
          Entrar
        </h1>

        {/* Campos do Formulário */}
        <div className="mt-10 space-y-6">
          {formFields.map((field) => (
            <div key={field.id} className="flex flex-col">
              {/* Label do input */}
              <label htmlFor={field.id} className="mb-1 text-[#343b3a] font-semibold">
                {field.label}
              </label>

              <div className="relative">
                {/* Input */}
                <InputForm
                  type={field.type}
                  id={field.id}
                  placeholder={field.label}
                  className="w-full h-14 bg-[#343b3a33] rounded-lg text-[#343b3a] text-base font-normal tracking-wide pl-4 pr-10"
                />

                {/* Ícone de mostrar/ocultar senha */}
                {field.id === "senha" && (
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#343b3a] hover:text-[#222] focus:outline-none"
                  >
                    {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botão Entrar */}
        <div className="mt-10 flex justify-center">
          <BotaoCont
            className="w-full max-w-[317px] h-14 bg-[#dc143c] hover:bg-[#c01236] rounded-full font-semibold text-[#f9f2df] text-lg tracking-widest"
            onClick={() => {
              console.log("Botão clicado! Redirecionando...");
              navigate("/chave_semente_entra");
            }} 
          >
            Entrar
          </BotaoCont>
        </div>

      </div>
    </main>
  );
}

