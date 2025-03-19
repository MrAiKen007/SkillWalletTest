import { ChevronDown, QrCode, Scan, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputForm from "../../components/Input/Registra/inputForm";
import BotaoCont from "../../components/Botao/BotaoCont";
import axios from "axios";

export default function Enviar() {
  const navigate = useNavigate();

  // Atualizamos os campos para "email" e "montante"
  const [formData, setFormData] = useState({
    email: "",      // campo para o email do destinatário
    montante: "",
  });
  const [activeField, setActiveField] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFocus = (id) => {
    setActiveField(id);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleConfirm = async () => {
    try {
      setErrorMessage("");
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token não encontrado. Faça login novamente.");
        return;
      }

      // Envia para a API de envio os dados de receiver_email e amount.
      const response = await axios.post(
        "http://127.0.0.1:8000/api/wallet/send/",
        {
          receiver_email: formData.email, // agora usando o campo "email"
          amount: formData.montante,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      navigate("/wallet");
    } catch (error) {
      console.error("Erro ao enviar tokens:", error);
      setErrorMessage("Não foi possível enviar tokens. Verifique os dados e tente novamente.");
    }
  };

  const formFields = [
    {
      id: "email",
      label: "Email do Destinatário",
      hasPaste: true,
      hasQrCode: true,
    },
    {
      id: "montante",
      label: "Montante",
      hasDropdown: true,
    },
    // Campo "comentar" removido
  ];

  return (
    <div className="bg-[#f9f2df] flex justify-center items-center w-full min-h-screen">
      <div className="bg-[#f9f2df] w-full max-w-[428px] px-3 py-9 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <button className="p-0 h-[35px] w-[35px] flex items-center justify-center bg-transparent">
            <Scan className="h-[35px] w-[35px] text-[#343b3a]" />
          </button>
          <h1 className="[font-family:'Inter-Regular',Helvetica] font-normal text-[#343b3a] text-2xl text-center">
            Enviar
          </h1>
          <button
            onClick={() => navigate("/wallet")}
            className="h-[50px] w-[50px] rounded-full bg-[#dc143c] p-0 flex items-center justify-center"
          >
            <X className="h-[35px] w-[35px] text-white" />
          </button>
        </header>

        {/* Campos do Formulário */}
        <div className="space-y-5 flex-grow">
          {/* Campo Email */}
          <div
            className={`relative bg-[#343b3a33] rounded-[15px] border border-solid ${
              activeField === "email" ? "border-[#dc143c]" : "border-[#343b3a33]"
            }`}
          >
            <div
              className="p-4 flex items-center justify-between h-[59px]"
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
            >
              <span className="[font-family:'Lufga-Regular',Helvetica] font-normal text-[#343b3a] text-base tracking-[2.00px] leading-[26.0px]">
                {formFields[0].label}
              </span>
              <div className="flex items-center">
                <div className="bg-[#f9f2df] rounded-[25px] px-3 py-0.5 mr-2">
                  <span className="[font-family:'Lufga-Regular',Helvetica] font-normal text-[#343b3a80] text-base tracking-[2.00px] leading-[26.0px]">
                    paste
                  </span>
                </div>
                <QrCode className="w-[22px] h-[22px] mr-4 text-[#343b3a]" />
              </div>
            </div>
            <InputForm
              id="email"
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              value={formData.email}
              onChange={handleChange}
              className="p-3 bg-[#f9f2df] rounded-[15px] w-full"
              placeholder="Digite o email do destinatário"
            />
          </div>

          {/* Campo Montante */}
          <div
            className={`relative bg-[#343b3a33] rounded-[15px] border border-solid ${
              activeField === "montante" ? "border-[#dc143c]" : "border-[#343b3a33]"
            }`}
          >
            <div
              className="p-4 flex items-center justify-between h-[59px]"
              onFocus={() => handleFocus("montante")}
              onBlur={handleBlur}
            >
              <span className="[font-family:'Lufga-Regular',Helvetica] font-normal text-[#343b3a] text-base tracking-[2.00px] leading-[26.0px]">
                {formFields[1].label}
              </span>
              <div className="flex items-center mr-4">
                <ChevronDown className="w-3 h-2 text-[#343b3a]" />
              </div>
            </div>
            <InputForm
              id="montante"
              onFocus={() => handleFocus("montante")}
              onBlur={handleBlur}
              value={formData.montante}
              onChange={handleChange}
              className="p-3 bg-[#f9f2df] rounded-[15px] w-full"
              placeholder="Digite o montante"
            />
          </div>
        </div>

        {/* Mensagem de Erro Geral */}
        {errorMessage && (
          <div className="mt-4 text-center text-red-600 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Botão Confirmar */}
        <div className="mt-auto mb-4 flex justify-center">
          <BotaoCont
            onClick={handleConfirm}
            className="w-[315px] h-16 bg-[#dc143c] rounded-full [font-family:'Lufga-SemiBold',Helvetica] font-semibold text-[#f9f2df] text-[15px] tracking-[2.00px] leading-[26px]"
          >
            Confirmar
          </BotaoCont>
        </div>
      </div>
    </div>
  );
}