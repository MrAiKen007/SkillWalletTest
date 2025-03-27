import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BotaoCriar from "../../components/Botao/BotaoCriar";
import Input from "../../components/Input/Registra/inputForm";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function NovaConta() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await axios.post(
        "https://skillwallettest.onrender.com/contas/api/contas/register/",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }
      );

      alert(response.data.message);
      console.log("Registro realizado com sucesso:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user?.email) {
        localStorage.setItem("userEmail", response.data.user.email);
      }
      if (response.data.user?.id) {
        localStorage.setItem("user_id", response.data.user.id);
      }

      const seedKey = response.data.seed_key;

      navigate("/chaves_semente_registra", { state: { seedKey } });
    } catch (error) {
      console.error("Erro ao registrar:", error);
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMessage = "Ocorreu um erro no registro:\n";
        for (const key in errors) {
          errorMessage += `${key}: ${errors[key]}\n`;
        }
        alert(errorMessage);
      } else {
        alert("Ocorreu um erro no registro. Verifique os dados e tente novamente.");
      }
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#f9f2df]">
      <div className="relative w-full max-w-[428px] min-h-[926px] px-6 py-4 bg-[#f9f2df]">
        {/* Botão de Voltar */}
        <button
          className="absolute top-[21px] left-[27px] w-[50px] h-[50px] rounded-full bg-[#dc143c] border-none hover:bg-[#c01236] flex items-center justify-center"
          onClick={() => navigate("/contas")}
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </button>
        <h1 className="mt-[131px] ml-[38px] text-2xl font-black text-[#343b3a]">
          Nova Conta
        </h1>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="text-[#343b3a] font-medium">
              Nome
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="mt-2 h-[59px] bg-[#343b3a33] rounded-[15px] border-none pl-6 text-base text-[#343b3a] w-full"
              placeholder="Digite seu nome de usuário"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-[#343b3a] font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 h-[59px] bg-[#343b3a33] rounded-[15px] border-none pl-6 text-base text-[#343b3a] w-full"
              placeholder="Digite seu email"
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="text-[#343b3a] font-medium">
              Senha
            </label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={mostrarSenha ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="h-[59px] bg-[#343b3a33] rounded-[15px] border-none pl-6 pr-12 text-base text-[#343b3a] w-full"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div>
            <label htmlFor="confirm_password" className="text-[#343b3a] font-medium">
              Confirmar Senha
            </label>
            <div className="relative mt-2">
              <Input
                id="confirm_password"
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={formData.confirm_password}
                onChange={handleChange}
                className="h-[59px] bg-[#343b3a33] rounded-[15px] border-none pl-6 pr-12 text-base text-[#343b3a] w-full"
                placeholder="Confirme sua senha"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="w-[315px] h-16 mx-auto">
            <BotaoCriar
              type="submit"
              className="w-full h-full bg-[#dc143c] rounded-full font-semibold text-[#f9f2df] text-[15px] tracking-[2.00px] hover:bg-[#c01236]"
            >
              Criar
            </BotaoCriar>
          </div>
        </form>
      </div>
    </div>
  );
}