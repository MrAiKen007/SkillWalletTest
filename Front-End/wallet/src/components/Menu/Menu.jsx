import { Link } from "react-router-dom";
import { Clock, Settings, Wallet } from "lucide-react";

export default function BottomNavigation({ activePage }) {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4">
      <div className="flex items-center justify-between w-full max-w-[271px] h-14 bg-white rounded-full shadow-md p-2">
        <Link
          to="/wallet"
          className={`rounded-full h-14 w-14 flex items-center justify-center ${
            activePage === 'wallet' ? 'text-[#dc143c]' : 'text-gray-400'
          }`}
        >
          <Wallet className="w-6 h-6" />
        </Link>
        <Link
          to="/historico"
          className={`rounded-full h-14 w-14 flex items-center justify-center ${
            activePage === 'history' ? 'text-[#dc143c]' : 'text-gray-400'
          }`}
        >
          <Clock className="w-6 h-6" />
        </Link>
        <Link
          to="/configure"
          className={`rounded-full h-14 w-14 flex items-center justify-center ${
            activePage === 'settings' ? 'text-[#dc143c]' : 'text-gray-400'
          }`}
        >
          <Settings className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
