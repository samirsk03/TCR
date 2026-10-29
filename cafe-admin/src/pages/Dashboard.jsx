
import { useEffect, useState, useRef } from "react";
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
  BellRing,
  CheckCircle2,
  Volume2,
  VolumeX,
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

  // Help Bell states
  const [helpRequests, setHelpRequests] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);

  const seenHelpRequestIds = useRef(new Set());
  const hasLoadedHelpRequests = useRef(false);
  const audioContextRef = useRef(null);

  // Play sound when a new help request arrives
  const playHelpAlert = () => {
    if (!soundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;

    if (audioContext.state !== "running") return;

    const playTone = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(
        0.2,
        startTime + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;

    playTone(880, now, 0.2);
    playTone(1175, now + 0.23, 0.25);
  };

  // Enable sound after staff interaction
  const enableHelpSound = async () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        alert("Your browser does not support notification sounds.");
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      await audioContextRef.current.resume();

      setSoundEnabled(true);
    } catch (error) {
      console.error("Could not enable help alert sound:", error);
    }
  };

  // Fetch pending help requests
  const fetchHelpRequests = async () => {
    try {
      const res = await api.get("/help-request/pending");
      const requests = res.data.data || [];

      const currentIds = new Set(
        requests.map((request) => request._id)
      );

      // First successful fetch establishes the baseline.
      // Existing requests do not trigger a sound on page load.
      if (!hasLoadedHelpRequests.current) {
        seenHelpRequestIds.current = currentIds;
        hasLoadedHelpRequests.current = true;
      } else {
        const hasNewRequest = requests.some(
          (request) =>
            !seenHelpRequestIds.current.has(request._id)
        );

        if (hasNewRequest) {
          playHelpAlert();
        }

        // Remember IDs so a temporarily disappearing request
        // doesn't trigger another alert if it reappears.
        currentIds.forEach((id) =>
          seenHelpRequestIds.current.add(id)
        );
      }

      setHelpRequests(requests);
    } catch (error) {
      console.error("Help requests fetch error:", error);
    }
  };

  // Resolve a help request
  const handleResolveHelpRequest = async (id) => {
    try {
      setResolvingId(id);

      await api.patch(`/help-request/${id}/resolve`);

      await fetchHelpRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to resolve the help request."
      );
    } finally {
      setResolvingId(null);
    }
  };

  // Existing dashboard data
  const fetchDashboard = async () => {
    try {
      const historyPeriod =
        period === "custom" ? "year" : period;

      const [historyRes, pendingRes, sessionsRes] =
        await Promise.all([
          api.get(`/session/history?period=${historyPeriod}`),
          api.get("/order-request/pending"),
          api.get("/session/active"),
        ]);

      const historyData = historyRes.data;

      const allBills = Array.isArray(historyData.data)
        ? historyData.data
        : Array.isArray(historyData.transactions)
        ? historyData.transactions
        : Array.isArray(historyData.history)
        ? historyData.history
        : [];

      if (period !== "custom") {
        setSummary(
          historyData.summary || {
            totalRevenue: 0,
            totalOrders: 0,
            totalRewardRedeemed: 0,
            totalManualDiscount: 0,
          }
        );
      } else if (!startDate || !endDate) {
        setSummary({
          totalRevenue: 0,
          totalOrders: 0,
          totalRewardRedeemed: 0,
          totalManualDiscount: 0,
        });
      } else if (allBills.length === 0) {
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
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59.999`);

        const filteredBills = allBills.filter((bill) => {
          const dateValue = bill.paidAt || bill.createdAt;

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

      setPendingOrders(pendingRes.data.count || 0);

      const sessions = sessionsRes.data.data || [];

      setActiveSessions(
        sessions.filter((s) => s.status === "active").length
      );

      setBillRequested(
        sessions.filter((s) => s.status === "bill_requested").length
      );
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    }
  };

  // Existing dashboard refresh
  useEffect(() => {
    fetchDashboard();
  }, [period, startDate, endDate]);

  // Poll help requests every 5 seconds
  useEffect(() => {
    fetchHelpRequests();

    const interval = setInterval(() => {
      fetchHelpRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Clean up browser audio when dashboard unmounts
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back, Samir 👋
        </p>

        {/* Period Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {["today", "week", "month", "year", "custom"].map(
            (p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-xl px-4 py-2 font-medium transition ${
                  period === p
                    ? "bg-[#6F4E37] text-white"
                    : "border border-gray-200 bg-white"
                }`}
              >
                {p === "custom" ? "CUSTOM DATE" : p.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* Custom Date Filter */}
        {period === "custom" && (
          <div className="mt-4 flex flex-wrap items-end gap-4 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#6F4E37]"
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
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#6F4E37]"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="rounded-xl bg-gray-100 px-4 py-3 font-medium transition hover:bg-gray-200"
            >
              Clear Dates
            </button>

            {startDate && endDate && startDate > endDate && (
              <p className="w-full text-sm text-red-600">
                End date must be on or after start date.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={`₹${Math.floor(summary.totalRevenue || 0)}`}
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
          value={summary.totalRewardRedeemed || 0}
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={ClipboardList}
          color="#d97706"
          onClick={() => navigate("/dashboard/pending-orders")}
        />

        <StatCard
          title="Active Sessions"
          value={activeSessions}
          icon={UtensilsCrossed}
          color="#16a34a"
          onClick={() => navigate("/dashboard/active-sessions")}
        />

        <StatCard
          title="Bill Requested"
          value={billRequested}
          icon={Receipt}
          color="#2563eb"
          onClick={() => navigate("/dashboard/active-sessions")}
        />
      </div>

      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionCard title="Summary">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-bold">
                ₹{Number(summary.totalRevenue || 0).toFixed(2)}
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
              <span className="font-bold">{pendingOrders}</span>
            </div>

            <div className="flex justify-between">
              <span>Active Sessions</span>
              <span className="font-bold">{activeSessions}</span>
            </div>

            <div className="flex justify-between">
              <span>Bill Requested</span>
              <span className="font-bold">{billRequested}</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
