import {
    ChevronRight,
    Lock,
    Sun,
    User,
  } from "lucide-react";
  import React from "react";
  import  Menu  from "../../components/Menu/Menu";
  
  export default function Settings() {

    const menuItems = [
      { title: "USER", icon: <User className="h-6 w-6" />, section: "user" },
      { title: "BACKUP", icon: <ChevronRight className="h-6 w-6" />, section: "user" },
      { title: "SECURITY", icon: <Lock className="h-6 w-6" />, section: "security" },
      { title: "CURRENCY", icon: <span className="font-bold text-sm">KZ</span>, section: "security" },
      { title: "BLACK", icon: <Sun className="h-6 w-6" />, section: "theme" },
    ];
  
    return (
      <div className="bg-[#f9f2df] flex flex-col items-center w-full min-h-screen px-4 sm:px-6 md:px-8 py-6">
        {/* Header */}
        <header className="mt-[85px] mb-[50px] w-full max-w-[428px]">
          <h1 className="font-black text-2xl text-[#343b3a]">Settings</h1>
        </header>
  
        {/* Settings List */}
        <div className="w-full max-w-[428px] space-y-4">
          {menuItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-[#f9f2df] p-4 h-[62px] border-b border-gray-300">
              <span className="font-black text-[#343b3a] text-base">{item.title}</span>
              <div>{item.icon}</div>
            </div>
          ))}
        </div>
  
        {/* Bottom Navigation */}
        <Menu activePage="settings" />
      </div>
    );
  }
  