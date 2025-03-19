import { Link } from "react-router-dom";
import { Download, UserPlus } from "lucide-react";
import React from "react";

export default function Conta() {
  
  const accountActions = [
    {
      id: 1,
      label: "Cria conta",
      icon: <UserPlus size={20} className="text-[#343b3a]" />,
      path: "/registra",  
    },
    {
      id: 2,
      label: "Exporta conta",
      icon: <Download size={20} className="text-[#343b3a]" />,
      path: "/Entra",
    },
  ];

  return (
    <main className="bg-[#f9f2df] flex justify-center w-full min-h-screen p-4">
      {/* Container central */}
      <div className="bg-[#f9f2df] w-full max-w-[428px] md:max-w-[600px] lg:max-w-[800px] h-auto md:h-[926px] relative px-3">
        <header className="pt-[90px] pb-6">
          <h1 className="text-2xl md:text-3xl font-black text-[#343b3a] [font-family:'Lufga-Black',Helvetica]">
            Conta
          </h1>
        </header>

        <section className="space-y-3">
        {accountActions.map((action) => (
            <Link key={action.id} to={action.path}>
              <div className="bg-[#343b3a33] rounded-[15px] cursor-pointer hover:bg-[#343b3a40] transition-colors">
                <div className="p-0">
                  <button className="flex items-center justify-center w-full h-[62px] relative">
                    <span className="absolute left-6">{action.icon}</span>
                    <span className="[font-family:'Lufga-Regular',Helvetica] font-normal text-[#343b3a] text-[15px] text-center">
                      {action.label}
                    </span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
