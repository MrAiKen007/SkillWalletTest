import {
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import React from "react";
import Menu from "../../components/Menu/Menu";

export default function Historico() {

  const transactions = [
    { type: "send", amount: "-2 TON", currency: "TON" },
    { type: "receive", amount: "+25 USDC", currency: "USDC" },
    { type: "send", amount: "-2 TON", currency: "TON" },
    { type: "receive", amount: "+25 USDC", currency: "USDC" },
  ];

  return (
    <main className="bg-[#f9f2df] flex justify-center w-full min-h-screen px-4 sm:px-6 md:px-8">
      <div className="bg-[#f9f2df] w-full max-w-[428px] h-auto min-h-screen relative flex flex-col">
        <header className="pt-20 px-6">
          <h1 className="font-black text-[#343b3a] text-2xl sm:text-3xl">Jan 26</h1>
        </header>

        <section className="px-4 sm:px-6 mt-16 space-y-3 flex flex-col">
          {transactions.map((transaction, index) => (
            <div
              key={`transaction-${index}`}
              className="bg-[#f9f2df] rounded-lg shadow-md border-none p-4 h-[62px] flex items-center justify-between"
            >
              {transaction.type === "send" ? (
                <ArrowUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <ArrowDownIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
              <span className="font-black text-[#343b3a] text-base sm:text-lg">
                {transaction.amount}
              </span>
            </div>
          ))}
        </section>
        <Menu activePage="history" />
      </div>
    </main>
  );
}
  
  