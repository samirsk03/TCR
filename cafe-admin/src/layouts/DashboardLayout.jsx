import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="h-screen flex bg-[#F6F3EF] dark:bg-[#111827] overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}