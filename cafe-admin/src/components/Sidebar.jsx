import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  History,
  LogOut, 
  SquareMenu,
  BadgeIndianRupee,
  MonitorCog,
  MessageSquareHeart,
  BookUser
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Menu",
    path: "/dashboard/menu",
    icon: SquareMenu,
  },
  {
    name: "Users",
    path: "/dashboard/users",
    icon: BookUser,
  },
  {
    name: "Pending Orders",
    path: "/dashboard/pending-orders",
    icon: ClipboardList,
  },
  {
    name: "Offers ",
    path: "/dashboard/offers",
    icon: BadgeIndianRupee,
  },
  {
    name: "Active Sessions",
    path: "/dashboard/active-sessions",
    icon: UtensilsCrossed,
  },
  {
    name: "History",
    path: "/dashboard/history",
    icon: History,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: MonitorCog,
  },
  {
    name: "Feedback",
    path: "/dashboard/feedback",
    icon: MessageSquareHeart,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 bg-white dark:bg-[#231F1C] border-r border-gray-200 dark:border-[#352E2A] flex-col">

      <div className="h-20 flex items-center justify-center">

        <h1 className="text-3xl font-bold text-[#6F4E37]">
          ☕ Cafe
        </h1>

      </div>

      <div className="flex-1 px-4">

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              end={menu.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                  isActive
                    ? "bg-[#6F4E37] text-white"
                    : "hover:bg-[#EFE8DF]"
                }`
              }
            >
              <Icon size={20} />

              {menu.name}
            </NavLink>
          );
        })}

      </div>

      <div className="p-4">

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-100 text-red-600">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}