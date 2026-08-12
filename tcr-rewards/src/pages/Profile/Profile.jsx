// src/pages/Profile/Profile.jsx

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  Shield,
  ArrowRight,
  LogOut,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";

const TIER_THRESHOLDS = {
  gold: 500,
  platinum: 1000,
};

const Profile = () => {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
  try {
    console.log("Calling /auth/me...");

    const res = await api.get("/auth/me");

    console.log("SUCCESS", res.data);

    setUser(res.data.user);

  } catch (err) {
    console.log("ERROR");

    console.log(err.response);

    console.log(err);

    alert(err.response?.data?.message || "API Failed");
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const points = user.rewardPoints || 0;

  const currentTier =
    points >= TIER_THRESHOLDS.platinum
      ? "Platinum"
      : points >= TIER_THRESHOLDS.gold
      ? "Gold"
      : "Silver";

  const nextTierValue =
    points >= TIER_THRESHOLDS.platinum
      ? points
      : points >= TIER_THRESHOLDS.gold
      ? TIER_THRESHOLDS.platinum
      : TIER_THRESHOLDS.gold;

  const progress = Math.min(
    (points / nextTierValue) * 100,
    100
  );

  return (
    <div className="animate-fade-in flex flex-col min-h-screen bg-transparent">

      {/* Header */}

      <section className="bg-sbGreen text-white py-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">

          <div className="w-28 h-28 md:w-40 md:h-40 bg-white rounded-[2.5rem] flex items-center justify-center text-sbGreen text-5xl md:text-7xl font-bold shadow-2xl transform -rotate-3">
            {user.name.charAt(0)}
          </div>

          <div className="text-center md:text-left">

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              {user.name}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-white/80 font-medium">

              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <Mail size={16} />
                {user.phone}
              </span>

              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <Phone size={16} />
                {user.phone}
              </span>

              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                <Calendar size={16} />
                {new Date(user.createdAt).toLocaleDateString()}
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* Body */}

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-12">

        {/* Rewards */}

        <section className="bg-sbCream rounded-[2.5rem] p-10 mb-12 border border-sbLight shadow-sm">

          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8">

            <div>

              <div className="inline-flex items-center gap-2 bg-sbGreen text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
                <Star size={14} fill="currentColor" />
                {currentTier} Status
              </div>

              <h2 className="text-2xl font-bold text-sbDark">
                Loyalty Progress
              </h2>

            </div>

            <div className="text-center md:text-right">

              <span className="text-5xl font-bold text-sbDark">
                {points}
              </span>

              <span className="block text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                Reward Points
              </span>

            </div>

          </div>

          <div className="reward-progress h-4 mb-6 bg-white border border-sbLight">

            <div
              className="reward-progress-fill rounded-full"
              style={{ width: `${progress}%` }}
            />

          </div>

          <p className="text-sm font-bold text-sbGreen uppercase tracking-widest">

            {points >= TIER_THRESHOLDS.platinum
              ? "You've reached Platinum Status!"
              : `${nextTierValue - points} points away from next tier.`}

          </p>

        </section>

        {/* Stats */}

        <div className="grid md:grid-cols-2 gap-6 mb-12">

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-gray-500">
              Reward Points
            </p>

            <h2 className="text-4xl font-bold">
              {user.rewardPoints}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-gray-500">
              Cafe Visits
            </p>

            <h2 className="text-4xl font-bold">
              {user.visitCount}
            </h2>

          </div>

        </div>

        {/* Menu */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {[
            {
              icon: User,
              label: "Personal Info",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Bell,
              label: "Notifications",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: Shield,
              label: "Privacy & MPIN",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: HelpCircle,
              label: "Support",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: Settings,
              label: "App Settings",
              color: "bg-gray-100 text-gray-600",
            },
          ].map((item, idx) => (

            <button
              key={idx}
              className="flex items-center justify-between p-6 bg-gray-50 border rounded-3xl hover:bg-white hover:shadow-md transition-all"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`p-3 rounded-2xl ${item.color}`}
                >
                  <item.icon size={20} />
                </div>

                <span className="font-bold">
                  {item.label}
                </span>

              </div>

              <ArrowRight size={18} />

            </button>

          ))}

          <button
            onClick={logout}
            className="flex items-center justify-between p-6 bg-red-50 border border-red-100 rounded-3xl hover:bg-red-100"
          >

            <div className="flex items-center gap-4">

              <div className="p-3 bg-red-100 rounded-2xl">
                <LogOut size={20} className="text-red-600" />
              </div>

              <span className="font-bold text-red-600">
                Sign Out
              </span>

            </div>

            <ArrowRight size={18} className="text-red-400" />

          </button>

        </div>

      </main>

      <footer className="py-12 text-center text-gray-400 text-xs">
        TCR Loyalty • {new Date().getFullYear()}
      </footer>

    </div>
  );
};

export default Profile;