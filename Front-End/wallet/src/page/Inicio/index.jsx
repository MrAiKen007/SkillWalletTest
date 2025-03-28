import { Link } from "react-router-dom";
import React from "react";
import BotaoCont from "../../components/Botao/BotaoCont";
import { CreditCard, Globe } from "lucide-react";

export default function BemVindo() {
  const features = [
    {
      icon: <CreditCard className="w-5 h-5 text-[#dc143c]" />,
      text: "Compre Palanca Coin e troque por outras moedas.",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#dc143c]" />,
      text: "Transfira ou receba dinheiro em qualquer lugar do mundo.",
    },
  ];

  return (
    <div className="bg-[#f9f2df] min-h-screen flex items-center justify-center">
      {/* Container que simula o “tamanho de celular” */}
      <div className="bg-[#f9f2df] w-full max-w-[428px] h-[926px] rounded-[30px] overflow-hidden relative flex flex-col items-center">
        
        {/* Título */}
        <h1 className="mt-[93px] [font-family:'Poppins-Bold',Helvetica] font-bold text-4xl text-center tracking-[2px] leading-[26px]">
          <span className="text-[#343b3a]">Bem vindo a </span>
          <span className="text-[#dc143c]">SkillWallet</span>
        </h1>

        {/* Lista de features */}
        <div className="flex flex-col space-y-[106px] mt-[112px] px-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-[31px] w-full"
            >
              <div className="mt-1">{feature.icon}</div>
              <p className="[font-family:'Lufga-Bold',Helvetica] font-bold text-[#343b3a] text-base text-center tracking-[2px] leading-[26px]">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Botão na parte inferior */}
        <div className="absolute bottom-[64px] w-[317px]">
          <div className="border-none shadow-none bg-transparent p-0">
            <Link to="/contas">
            <BotaoCont className="w-full h-16 rounded-full bg-[#dc143c] hover:bg-[#c01236] [font-family:'Lufga-SemiBold',Helvetica] font-semibold text-[#f9f2df] text-[15px] tracking-[2px]">
              Continuar
            </BotaoCont>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

