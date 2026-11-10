
import { useEffect, useState } from "react";
import api from "../services/api";
import SessionCard from "../components/SessionCard";
import { useStoreSettings } from "../context/StoreSettingContext";

export default function ActiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Help requests
  const [helpRequests, setHelpRequests] = useState([]);
  const [helpLoading, setHelpLoading] = useState(false);
  const [updatingHelpId, setUpdatingHelpId] = useState(null);

  const { settings } = useStoreSettings();

  // Fetch active sessions
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

  // Fetch all pending help requests
  const fetchHelpRequests = async () => {
    try {
      setHelpLoading(true);

      const res = await api.get("/help-request/pending");

      setHelpRequests(res.data.data || []);
    } catch (err) {
      console.error("Failed to load help requests:", err);
    } finally {
      setHelpLoading(false);
    }
  };

  // Update help request status
  const updateHelpStatus = async (requestId, status) => {
    try {
      setUpdatingHelpId(requestId);

      await api.patch(
        `/help-request/${requestId}/status`,
        { status }
      );

      await fetchHelpRequests();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Unable to update help request."
      );
    } finally {
      setUpdatingHelpId(null);
    }
  };

  // Initial loading and automatic refresh
  useEffect(() => {
    fetchSessions();
    fetchHelpRequests();

    const interval = setInterval(() => {
      fetchSessions();
      fetchHelpRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const activeCount = sessions.filter(
    (s) => s.status === "active"
  ).length;

  const billRequestedCount = sessions.filter(
    (s) => s.status === "bill_requested"
  ).length;

  const totalRevenue = sessions.reduce(
    (sum, s) => sum + Number(s.totalAmount || 0),
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl font-black">
            Active Sessions
          </h1>

          <p className="text-gray-500">
            Tap any session to manage it
          </p>
        </div>

        <button
          onClick={() => {
            fetchSessions();
            fetchHelpRequests();
          }}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Refresh
        </button>

      </div>

      {/* HELP REQUESTS */}

      <div className="mb-8 rounded-2xl bg-white p-5 shadow">

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">
                Help Requests
              </h2>

              {helpRequests.length > 0 && (
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                  {helpRequests.length} Pending
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Customers requesting staff assistance
            </p>
          </div>

          <button
            onClick={fetchHelpRequests}
            disabled={helpLoading}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            {helpLoading ? "Refreshing..." : "↻ Refresh"}
          </button>

        </div>

        {helpLoading && helpRequests.length === 0 ? (

          <p className="py-6 text-center text-gray-500">
            Loading help requests...
          </p>

        ) : helpRequests.length === 0 ? (

          <div className="rounded-xl bg-gray-50 py-8 text-center">
            <p className="font-medium text-gray-600">
              No pending help requests
            </p>

            <p className="mt-1 text-sm text-gray-400">
              New requests will appear here automatically.
            </p>
          </div>

        ) : (

          <div className="space-y-3">

            {helpRequests.map((request) => (

              <div
                key={request._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50/50 p-4"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#9b6a32] text-lg font-black text-white">
                    {request.tableNumber}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Table {request.tableNumber}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {request.customerId?.name || "Customer"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {request.customerId?.phone || ""}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Requested:{" "}
                      {new Date(
                        request.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    PENDING
                  </span>

                  <button
                    onClick={() =>
                      updateHelpStatus(
                        request._id,
                        "attended"
                      )
                    }
                    disabled={updatingHelpId === request._id}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                  >
                    {updatingHelpId === request._id
                      ? "Updating..."
                      : "Attended"}
                  </button>

                  <button
                    onClick={() =>
                      updateHelpStatus(
                        request._id,
                        "resolved"
                      )
                    }
                    disabled={updatingHelpId === request._id}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Resolve
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* SESSION STATS */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-gray-500">
            Active
          </p>

          <h2 className="text-3xl font-black text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-gray-500">
            Bill Requested
          </p>

          <h2 className="text-3xl font-black text-orange-500">
            {billRequestedCount}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-gray-500">
            Current Revenue
          </p>

          <h2 className="text-3xl font-black">
            ₹{totalRevenue.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* ACTIVE SESSION CARDS */}

      {sessions.length === 0 ? (

        <div className="rounded-3xl bg-white p-10 text-center shadow">

          <h2 className="text-xl font-semibold">
            No Active Sessions
          </h2>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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
