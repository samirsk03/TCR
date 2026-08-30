// src/pages/ActiveSessions.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import SessionCard from "../components/SessionCard";
import { useStoreSettings } from "../context/StoreSettingContext";

export default function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useStoreSettings();



  const fetchSessions = async () => {
    try {
      const res = await api.get("/session/active");
      setSessions(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to load sessions."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSessions();
  }, []);

  const activeCount = sessions.filter(
    (s) => s.status === "active"
  ).length;

  const billRequestedCount = sessions.filter(
    (s) => s.status === "bill_requested"
  ).length;

  const totalRevenue = sessions.reduce(
    (sum, s) => sum + s.totalAmount,
    0
  );

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Active Sessions
        </h1>

        <p className="mt-5">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-black">
            Active Sessions
          </h1>

          <p className="text-gray-500">
            Tap any session to manage it
          </p>
        </div>

        <button
          onClick={fetchSessions}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500">
            Active
          </p>

          <h2 className="text-3xl font-black text-green-600">
            {activeCount}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500">
            Bill Requested
          </p>

          <h2 className="text-3xl font-black text-orange-500">
            {billRequestedCount}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-5">

          <p className="text-gray-500">
            Current Revenue
          </p>

          <h2 className="text-3xl font-black">
            ₹{totalRevenue}
          </h2>

        </div>

      </div>

      {sessions.length === 0 ? (

        <div className="bg-white rounded-3xl shadow p-10 text-center">

          <h2 className="text-xl font-semibold">
            No Active Sessions
          </h2>

        </div>

      ) : (

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-5
        "
        >

          {sessions.map((session) => (

            <SessionCard
              key={session._id}
              session={session}
              refresh={fetchSessions}
            />

          ))}

        </div>

      )}

    </div>
  );
}