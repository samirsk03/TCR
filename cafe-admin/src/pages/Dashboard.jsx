import { useEffect, useState } from "react";
import api from "../services/api";

import {
  DollarSign,
  ClipboardList,
  UtensilsCrossed,
  Receipt,
  Gift,
  Percent,
} from "lucide-react";

import StatCard from "../ui/StatCard";
import SectionCard from "../ui/SectionCard";

export default function Dashboard() {
  const [period, setPeriod] = useState("today");

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalRewardRedeemed: 0,
    totalManualDiscount: 0,
  });

  const [pendingOrders, setPendingOrders] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [billRequested, setBillRequested] = useState(0);

  const fetchDashboard = async () => {
    try {
      const [
        historyRes,
        pendingRes,
        sessionsRes,
      ] = await Promise.all([
        api.get(
          `/session/history?period=${period}`
        ),
        api.get("/order-request/pending"),
        api.get("/session/active"),
      ]);

      setSummary(
        historyRes.data.summary || {}
      );

      setPendingOrders(
        pendingRes.data.count || 0
      );

      const sessions =
        sessionsRes.data.data || [];

      setActiveSessions(
        sessions.filter(
          (s) => s.status === "active"
        ).length
      );

      setBillRequested(
        sessions.filter(
          (s) =>
            s.status === "bill_requested"
        ).length
      );

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [period]);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back, Samir 👋
        </p>

        {/* Filters */}

        <div className="flex gap-2 flex-wrap mt-5">

          {[
            "today",
            "week",
            "month",
            "year",
          ].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                period === p
                  ? "bg-[#6F4E37] text-white"
                  : "bg-white border border-gray-200"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}

        </div>

      </div>

      {/* Main Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Revenue"
          value={`₹${Math.floor(summary.totalRevenue )|| 0}`}
          icon={DollarSign}
          color="#6F4E37"
        />

        <StatCard
          title="Total Bills"
          value={summary.totalOrders || 0}
          icon={Receipt}
          color="#2563eb"
        />

        <StatCard
          title="Points Redeemed"
          value={
            summary.totalRewardRedeemed || 0
          }
          icon={Gift}
          color="#16a34a"
        />

        <StatCard
          title="Manual Discount"
          value={`₹${summary.totalManualDiscount || 0}`}
          icon={Percent}
          color="#dc2626"
        />

      </div>

      {/* Operations Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={ClipboardList}
          color="#d97706"
        />

        <StatCard
          title="Active Sessions"
          value={activeSessions}
          icon={UtensilsCrossed}
          color="#16a34a"
        />

        <StatCard
          title="Bill Requested"
          value={billRequested}
          icon={Receipt}
          color="#2563eb"
        />

      </div>

      {/* Bottom Section */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <SectionCard title="Summary">

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-bold">
                ₹{summary.totalRevenue || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Bills</span>
              <span className="font-bold">
                {summary.totalOrders || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Redeemed Points</span>
              <span className="font-bold">
                {summary.totalRewardRedeemed || 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Manual Discount</span>
              <span className="font-bold">
                ₹{summary.totalManualDiscount || 0}
              </span>
            </div>

          </div>

        </SectionCard>

        <SectionCard title="Live Operations">

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Pending Orders</span>
              <span className="font-bold">
                {pendingOrders}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Active Sessions</span>
              <span className="font-bold">
                {activeSessions}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Bill Requested</span>
              <span className="font-bold">
                {billRequested}
              </span>
            </div>

          </div>

        </SectionCard>

      </div>

    </div>
  );
}