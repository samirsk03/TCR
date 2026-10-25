import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  Bell,
  Moon,
  X,
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  History,
  BadgeIndianRupee,
  MonitorCog,
  MessageSquareHeart,
  BookUser,
  UserPlus,
  SquareMenu,
  LogOut,
  
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff"],
  },
  {
    name: "Menu",
    path: "/dashboard/menu",
    icon: SquareMenu,
    roles: ["admin"],
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: BookUser,
    roles: ["admin"],
  },
  {
    name: "Create User",
    path: "/dashboard/create-user",
    icon: UserPlus,
    roles: ["admin"],
  },
  {
    name: "Pending Orders",
    path: "/dashboard/pending-orders",
    icon: ClipboardList,
    roles: ["admin", "staff"],
  },
  {
    name: "Offers",
    path: "/dashboard/offers",
    icon: BadgeIndianRupee,
    roles: ["admin"],
  },
  {
    name: "Active Sessions",
    path: "/dashboard/active-sessions",
    icon: UtensilsCrossed,
    roles: ["admin", "staff"],
  },
  {
    name: "History",
    path: "/dashboard/history",
    icon: History,
    roles: ["admin"],
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: MonitorCog,
    roles: ["admin"],
  },
  {
    name: "Feedback",
    path: "/dashboard/feedback",
    icon: MessageSquareHeart,
    roles: ["admin"],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAuth();

  const userRole = user?.role;

  const visibleMenus = menus.filter((menu) =>
    menu.roles.includes(userRole)
  );

  return (
    <>
      <header className="h-16 bg-white dark:bg-[#231F1C] border-b border-gray-200 dark:border-[#352E2A] flex items-center justify-between px-6">

        {/* Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#6F4E37]">
          Cafe Admin
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          <Bell size={20} />

          <Moon size={20} />

          <div className="w-10 h-10 rounded-full bg-[#6F4E37] text-white flex items-center justify-center">
            S
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >

          {/* Drawer */}
          <div
            className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#231F1C] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Drawer Header */}
            <div className="h-20 flex items-center justify-between px-5 border-b border-gray-200 dark:border-[#352E2A]">

              <h1 className="text-2xl font-bold text-[#6F4E37]">
                ☕ Cafe Admin
              </h1>

              <button
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={24} />
              </button>

            </div>

            {/* Navigation */}
            <div className="p-4">

              {visibleMenus.map((menu) => {
                const Icon = menu.icon;

                return (
                  <NavLink
                    key={menu.path}
                    to={menu.path}
                    end={menu.path === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all font-medium ${isActive
                        ? "bg-[#6F4E37] text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-[#EFE8DF] dark:hover:bg-[#352E2A] hover:text-[#6F4E37] dark:hover:text-white"
                      }`
                    }
                  >
                    <Icon size={20} />
                    {menu.name}
                  </NavLink>
                );
              })}

            </div>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4">

              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-100 text-red-600">
                <LogOut size={20} />
                Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}