import { X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputForm from "../../components/Input/Registra/inputForm";
import BotaoCont from "../../components/Botao/BotaoCont";

export default function Deposito() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");


  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

 
      const response = await axios.post(
        "https://skillwallettest.onrender.com/contas/api/wallet/deposit/",
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {

        alert("Depósito realizado com sucesso!");

        navigate("/wallet");
      }
    } catch (error) {
      console.error("Erro ao depositar:", error);
      alert("Não foi possível depositar. Verifique o valor ou tente novamente.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#f9f2df] p-4">
      <div className="relative w-full max-w-[428px] h-auto min-h-[600px] bg-[#f9f2df] rounded-2xl shadow-lg p-6">
        {/* Botão de fechar - Redireciona para a wallet */}
        <button
          onClick={() => navigate("/wallet")}
          className="absolute top-5 right-5 w-[45px] h-[45px] rounded-full bg-[#dc143c] hover:bg-[#dc143c]/90 flex items-center justify-center"
        >
          <X className="w-[30px] h-[30px] text-white" />
        </button>

        <h1 className="mt-14 text-center text-2xl font-bold text-[#343b3a]">
          Depósito
        </h1>

        {/* Campo de input para valor do depósito */}
        <div className="mt-10">
          <InputForm
            placeholder="Valor do depósito"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Botão que dispara o depósito */}
        <div className="mt-6 flex justify-center">
          <BotaoCont
            onClick={handleDeposit}
            className="bg-[#dc143c] hover:bg-[#dc143c]/90 text-white w-full max-w-[300px] h-14 rounded-full font-semibold text-lg"
          >
            Confirmar Depósito
          </BotaoCont>
        </div>
      </div>
    </div>
  );
}