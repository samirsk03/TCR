
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
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
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  const [period, setPeriod] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      // Use the existing history API.
      // For custom dates, request the yearly history as the available
      // broader period, then filter its returned bills locally.
      const historyPeriod =
        period === "custom" ? "year" : period;

      const [historyRes, pendingRes, sessionsRes] =
        await Promise.all([
          api.get(
            `/session/history?period=${historyPeriod}`
          ),
          api.get("/order-request/pending"),
          api.get("/session/active"),
        ]);

      const historyData = historyRes.data;

      // Support common response structures containing bill records.
      const allBills = Array.isArray(historyData.data)
        ? historyData.data
        : Array.isArray(historyData.transactions)
        ? historyData.transactions
        : Array.isArray(historyData.history)
        ? historyData.history
        : [];

      if (period !== "custom") {
        // Preserve the existing summary behavior.
        setSummary(historyData.summary || {
          totalRevenue: 0,
          totalOrders: 0,
          totalRewardRedeemed: 0,
          totalManualDiscount: 0,
        });
      } else if (!startDate || !endDate) {
        // Wait until both dates are selected.
        setSummary({
          totalRevenue: 0,
          totalOrders: 0,
          totalRewardRedeemed: 0,
          totalManualDiscount: 0,
        });
      } else {
        if (allBills.length === 0) {
          console.warn(
            "The history API did not return individual bills. " +
            "Custom date filtering requires those records."
          );

          setSummary({
            totalRevenue: 0,
            totalOrders: 0,
            totalRewardRedeemed: 0,
            totalManualDiscount: 0,
          });
        } else {
          const start = new Date(
            `${startDate}T00:00:00`
          );

          const end = new Date(
            `${endDate}T23:59:59.999`
          );

          const filteredBills = allBills.filter((bill) => {
            const dateValue =
              bill.paidAt || bill.createdAt;

            if (!dateValue) return false;

            const billDate = new Date(dateValue);

            return (
              !Number.isNaN(billDate.getTime()) &&
              billDate >= start &&
              billDate <= end
            );
          });

          setSummary({
            totalRevenue: filteredBills.reduce(
              (sum, bill) =>
                sum + Number(bill.totalAmount || 0),
              0
            ),

            totalOrders: filteredBills.length,

            totalRewardRedeemed: filteredBills.reduce(
              (sum, bill) =>
                sum + Number(bill.redeemedPoints || 0),
              0
            ),

            totalManualDiscount: filteredBills.reduce(
              (sum, bill) =>
                sum + Number(bill.manualDiscount || 0),
              0
            ),
          });
        }
      }

      // Pending orders
      setPendingOrders(
        pendingRes.data.count || 0
      );

      // Active sessions and bill requests
      const sessions = sessionsRes.data.data || [];

      setActiveSessions(
        sessions.filter(
          (s) => s.status === "active"
        ).length
      );

      setBillRequested(
        sessions.filter(
          (s) => s.status === "bill_requested"
        ).length
      );
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [period, startDate, endDate]);

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

        {/* Period Filters */}
        <div className="flex gap-2 flex-wrap mt-5">
          {[
            "today",
            "week",
            "month",
            "year",
            "custom",
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
              {p === "custom"
                ? "CUSTOM DATE"
                : p.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Custom Date Filter */}
        {period === "custom" && (
          <div className="flex flex-wrap items-end gap-4 mt-4 p-4 bg-white rounded-2xl border border-gray-200">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#6F4E37]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#6F4E37]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition"
            >
              Clear Dates
            </button>

            {startDate &&
              endDate &&
              startDate > endDate && (
                <p className="w-full text-sm text-red-600">
                  End date must be on or after start date.
                </p>
              )}
          </div>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value={`₹${Math.floor(
            summary.totalRevenue || 0
          )}`}
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
          value={`₹${Number(
            summary.totalManualDiscount || 0
          ).toFixed(2)}`}
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
          onClick={() =>
            navigate("/dashboard/pending-orders")
          }
        />

        <StatCard
          title="Active Sessions"
          value={activeSessions}
          icon={UtensilsCrossed}
          color="#16a34a"
          onClick={() =>
            navigate("/dashboard/active-sessions")
          }
        />

        <StatCard
          title="Bill Requested"
          value={billRequested}
          icon={Receipt}
          color="#2563eb"
          onClick={() =>
            navigate("/dashboard/active-sessions")
          }
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Summary">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-bold">
                ₹{Number(
                  summary.totalRevenue || 0
                ).toFixed(2)}
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
                ₹{Number(
                  summary.totalManualDiscount || 0
                ).toFixed(2)}
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
