import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotaoCriar from "../../components/Botao/BotaoCriar";
import Input from "../../components/Input/Registra/inputForm";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function NovaConta() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Dados do formulário:", formData);
    

    navigate("/chaves_semente_registra");
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-[#f9f2df]">
      <div className="relative w-full max-w-[428px] min-h-[926px] px-6 py-4 bg-[#f9f2df]">
        
        {/* Botão Voltar */}
        <button
          className="absolute top-[21px] left-[27px] w-[50px] h-[50px] rounded-full bg-[#dc143c] border-none hover:bg-[#c01236] flex items-center justify-center"
          onClick={() => navigate("/contas")}
        >
          <ArrowLeft className="h-4 w-4 text-white" />
        </button>

        {/* Título */}
        <h1 className="mt-[131px] ml-[38px] text-2xl font-black text-[#343b3a]">
          Nova Conta
        </h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="text-[#343b3a] font-medium">Nome</label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              className="mt-2 h-[59px] bg-[#343b3a33] rounded-[15px] border-none pl-6 text-base text-[#343b3a] w-full"
              placeholder="Digite seu nome"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-[#343b3a] font-medium">Email</label>
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
            <label htmlFor="senha" className="text-[#343b3a] font-medium">Senha</label>
            <div className="relative mt-2">
              <Input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                value={formData.senha}
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
            <label htmlFor="confirmarSenha" className="text-[#343b3a] font-medium">Confirmar Senha</label>
            <div className="relative mt-2">
              <Input
                id="confirmarSenha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={formData.confirmarSenha}
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

          {/* Botão Criar */}
          <div className="w-[315px] h-16 mx-auto">
            <BotaoCriar type="submit" className="w-full h-full bg-[#dc143c] rounded-full font-semibold text-[#f9f2df] text-[15px] tracking-[2.00px] hover:bg-[#c01236]">
              Criar
            </BotaoCriar>
          </div>
        </form>
      </div>
    </div>
  );
}


