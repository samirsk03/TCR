import { Menu, Bell, Moon } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white dark:bg-[#231F1C] border-b border-gray-200 dark:border-[#352E2A] flex items-center justify-between px-6">

      <button className="lg:hidden">
        <Menu size={24} />
      </button>

      <h1 className="text-xl font-bold text-[#6F4E37]">
        Cafe Admin
      </h1>

      <div className="flex items-center gap-5">

        <Bell size={20} />

        <Moon size={20} />

        <div className="w-10 h-10 rounded-full bg-[#6F4E37] text-white flex items-center justify-center">
          S
        </div>

      </div>

    </header>
  );
}