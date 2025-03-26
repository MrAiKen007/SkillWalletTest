import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BotaoCont from '../../components/Botao/BotaoCont';
import InputForm from '../../components/Input/Registra/inputForm';
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export default function EntraConta() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.id === "email") setErrorEmail("");
    if (e.target.id === "password") setErrorPassword("");
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    setErrorEmail("");
    setErrorPassword("");

    try {
      // Faz login e espera receber seed_key, token e dados do usuário do back-end
      const response = await axios.post("http://localhost:8000/api/contas/login/", {
        email: formData.email,
        password: formData.password,
      });

      // Armazena o token JWT no localStorage para requisições futuras
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Armazena o email e o ID do usuário no localStorage
      if (response.data.user) {
        if (response.data.user.email) {
          localStorage.setItem("userEmail", response.data.user.email);
        }
        if (response.data.user.id) {
          localStorage.setItem("user_id", response.data.user.id);
        }
      }

      // Recupera a seed_key retornada pelo back-end (se houver)
      const seedFromServer = response.data.seed_key;

      // Navega para a tela de confirmação, passando a seed se necessário
      navigate("/chave_semente_entra", { state: { seedKey: seedFromServer } });
    } catch (error) {
      console.error("Erro ao entrar:", error);
      const errorMsg = error.response?.data || "Erro ao fazer login. Verifique suas credenciais.";
      let message = "";
      if (typeof errorMsg === "string") {
        message = errorMsg;
      } else if (typeof errorMsg === "object") {
        message = Object.values(errorMsg).flat().join(" ");
      }
      if (message.includes("Usuário não encontrado")) {
        setErrorEmail(message);
      } else if (message.includes("E-mail ou senha incorretos")) {
        setErrorPassword(message);
      } else {
        alert(message);
      }
    }
  };

  const formFields = [
    { id: "email", label: "Email", type: "text" },
    { id: "password", label: "Senha", type: mostrarSenha ? "text" : "password" },
  ];

  return (
    <main className="bg-[#f9f2df] flex justify-center items-center w-full min-h-screen px-4">
      <div className="bg-[#f9f2df] w-full max-w-sm sm:max-w-md h-auto py-10 px-6 bg-[#f9f2df] rounded-lg shadow-md relative">
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
              <label htmlFor={field.id} className="mb-1 text-[#343b3a] font-semibold">
                {field.label}
              </label>
              <div className="relative">
                <InputForm
                  type={field.type}
                  id={field.id}
                  placeholder={field.label}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="w-full h-14 bg-[#343b3a33] rounded-lg text-[#343b3a] text-base font-normal tracking-wide pl-4 pr-10"
                />
                {field.id === "password" && (
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#343b3a] hover:text-[#222] focus:outline-none"
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
              {field.id === "email" && errorEmail && (
                <span className="text-red-500 text-sm mt-1">{errorEmail}</span>
              )}
              {field.id === "password" && errorPassword && (
                <span className="text-red-500 text-sm mt-1">{errorPassword}</span>
              )}
            </div>
          ))}
        </div>

        {/* Botão Entrar */}
        <div className="mt-10 flex justify-center">
          <BotaoCont
            onClick={handleSubmit}
            className="w-full max-w-[317px] h-14 bg-[#dc143c] hover:bg-[#c01236] rounded-full font-semibold text-[#f9f2df] text-lg tracking-widest"
          >
            Entrar
          </BotaoCont>
        </div>
      </div>
    </main>
  );
}
