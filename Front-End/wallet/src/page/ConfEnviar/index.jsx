import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const SwipeButton = ({ onConfirm }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [setDragX] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-[317px] h-16 bg-[#dc143c] rounded-full overflow-hidden flex items-center justify-center">
      {/* Texto */}
      <span className="absolute text-white font-bold tracking-[2px]">
        {showCheck ? "Confirmado!" : "Deslize para confirmar"}
      </span>

      {/* Botão Arrastável */}
      <motion.div
        className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center absolute left-[5px] cursor-pointer"
        drag="x"
        dragConstraints={{ left: 0, right: 240 }}
        onDrag={(event, info) => setDragX(info.point.x)}
        onDragEnd={(event, info) => {
          if (info.point.x >= 230) {
            setIsConfirmed(true);
            setShowCheck(true);
            onConfirm();
            setTimeout(() => {
              setIsConfirmed(false);
              navigate("/wallet");
            }, 1500);
          } else {
            setDragX(0);
            setIsConfirmed(false);
          }
        }}
        animate={{ backgroundColor: isConfirmed ? "#06a154" : "#ffffff" }}
      >
        {showCheck ? (
          <Check className="h-6 w-6 text-black" />
        ) : (
          <ArrowRight className="h-6 w-6 text-black" />
        )}
      </motion.div>
    </div>
  );
};


const Confirmar = () => {
  const navigate = useNavigate();
  const transactionData = [
    { label: "Endereço", value: "EQAAA...AAAM9c" },
    { label: "Valor", value: "50,000,00 PLC" },
    { label: "Taxa", value: "500,00 PLC" },
    { label: "Comentar", value: "LOL" },
  ];

  return (
    <div className="flex justify-center w-full bg-[#f9f2df] min-h-screen px-4 sm:px-6 md:px-8">
      <div className="relative w-full max-w-[428px] bg-[#f9f2df] px-3 py-5">
        {/* Back Button */}
        <button
          onClick={() => navigate("/enviar")}
          className="absolute top-[21px] left-[31px] w-[50px] h-[50px] bg-[#dc143c] rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mt-24 mb-16">
          <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center">
            <img src="" alt="Logo" className="w-12 h-12" />
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3 mb-3">
          {transactionData.map((item, index) => (
            <div
              key={index}
              className="bg-[#343b3a33] border-none rounded-[15px] p-4 flex justify-between items-center"
            >
              <span className="font-black text-[#343b3acc] text-base">
                {item.label}
              </span>
              <span className="font-light text-[#343b3acc] text-[11px] tracking-[2.00px] leading-[26.0px]">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-[#343b3a33] border-none rounded-[15px] mt-6 p-4 flex justify-between items-center">
          <span className="font-black text-[#343b3acc] text-base">Total</span>
          <span className="font-light text-[#343b3acc] text-[11px] tracking-[2.00px] leading-[26.0px]">
            49,500,00 PLC
          </span>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center mt-16">
          <SwipeButton onConfirm={() => console.log("Transação Confirmada!")} />
        </div>
      </div>
    </div>
  );
};

export default Confirmar;