import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import React from "react";

export default function Chave() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/wallet");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="bg-[#f9f2df] flex justify-center items-center min-h-screen w-full px-6">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <h1 className="mb-8 font-black text-2xl text-[#343b3a] leading-normal">
          Parabéns! Conta exportada com sucesso
        </h1>

        <CheckCircle
          className="w-40 h-40 text-[#d91c5c] stroke-[1.5px] fill-none"
          aria-label="Success icon"
        />

        <p className="mt-4 text-[#343b3a] text-lg">Redirecionando...</p>
      </div>
    </main>
  );
}
