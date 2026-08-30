import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  History,
  Settings,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pending Orders",
    path: "/dashboard/pending-orders",
    icon: ClipboardList,
  },
  {
    title: "Active Sessions",
    path: "/dashboard/active-sessions",
    icon: UtensilsCrossed,
  },
  {
    title: "History",
    path: "/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];