
import { useState } from "react";
import {
  BellRing,
  LoaderCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import api from "../services/api";

const TABLE_KEY = "tcr_help_table_number";

export default function HelpBell() {
  const [tableNumber, setTableNumber] = useState(
    localStorage.getItem(TABLE_KEY) || ""
  );
  const [inputTable, setInputTable] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const sendRequest = async (table) => {
    if (loading) return;

    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      const res = await api.post("/help-request", {
        tableNumber: table,
      });

      setSuccess(true);
      setMessage(
        res.data.message || "Staff has been notified!"
      );
      setShowModal(false);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
          "Unable to send your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setMessage("");
    setSuccess(false);

    if (tableNumber) {
      sendRequest(tableNumber);
    } else {
      setInputTable("");
      setShowModal(true);
    }
  };

  const handleSaveTable = async () => {
    const table = inputTable.trim();

    if (!table) {
      setMessage("Please enter your table number.");
      setSuccess(false);
      return;
    }

    localStorage.setItem(TABLE_KEY, table);
    setTableNumber(table);

    await sendRequest(table);
  };

  const changeTable = () => {
    setInputTable(tableNumber);
    setShowModal(true);
    setMessage("");
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">

      {message && (
        <div
          role="status"
          className={`max-w-[280px] rounded-xl border px-4 py-3 text-sm shadow-lg ${
            success
              ? "border-green-200 bg-white text-green-800"
              : "border-red-200 bg-white text-red-700"
          }`}
        >
          <div className="flex items-start gap-2">
            {success && (
              <CheckCircle2 size={18} className="shrink-0" />
            )}
            <span>{message}</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleBellClick}
        disabled={loading}
        aria-label="Request staff assistance"
        title="Need help? Tap here"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9b6a32] text-white shadow-xl transition hover:bg-[#805326] active:scale-95 disabled:opacity-70"
      >
        {loading ? (
          <LoaderCircle size={25} className="animate-spin" />
        ) : (
          <BellRing size={25} />
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Call for Assistance
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              Enter your table number so our staff can find you.
            </p>

            <input
              type="text"
              value={inputTable}
              onChange={(e) => setInputTable(e.target.value)}
              placeholder="Enter table number"
              className="mb-3 w-full rounded-lg border px-4 py-3 outline-none focus:border-[#9b6a32]"
            />

            {message && !success && (
              <p className="mb-3 text-sm text-red-600">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveTable}
              disabled={loading}
              className="w-full rounded-lg bg-[#9b6a32] py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Sending..." : "Call Staff"}
            </button>

            {tableNumber && (
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-3 w-full text-sm text-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {tableNumber && !showModal && (
        <button
          type="button"
          onClick={changeTable}
          className="text-xs text-gray-500 underline"
        >
          Table {tableNumber} · Change
        </button>
      )}
    </div>
  );
}
